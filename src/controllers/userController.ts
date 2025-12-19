import { Request, Response } from "express";
import { prisma } from "../prisma";
import { sendSuccess, sendError } from "../utils/response";
import { createUserSchema, updateUserSchema } from "../schema/user-schema";
import { getPagination, buildPaginationMeta } from "../utils/pagination";

export async function getUser(req: Request, res: Response) {
  const user = (req as any).user;
  return sendSuccess(res, 200, "User retrieved successfully", user);
}

export async function listUsers(req: Request, res: Response) {
  const { page, perPage, skip, take } = getPagination(req.query);
  const searchRaw = req.query.search;
  const roleRaw = req.query.role;
  const search = typeof searchRaw === "string" ? searchRaw.trim() : undefined;
  const role = typeof roleRaw === "string" ? roleRaw.trim() : undefined;

  const where: any = {};

  if (search && search.length > 0) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (role && role.length > 0) {
    where.user_roles = {
      some: {
        roles: {
          slug: role,
        },
      },
    };
  }

  const [users, total] = await Promise.all([
    prisma.users.findMany({
      where,
      orderBy: { id: "asc" },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
        user_permissions: {
          include: {
            permissions: true,
          },
        },
      },
      skip,
      take,
    }),
    prisma.users.count({ where }),
  ]);
  const data = users.map((user) => {
    const primaryRole =
      user.user_roles && user.user_roles.length > 0
        ? user.user_roles[0].roles
        : null;
    const permissions =
      user.user_permissions?.map((up) => ({
        id: up.permission_id,
        slug: up.permissions ? up.permissions.slug : null,
      })) ?? [];
    return {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      email_verified_at: user.email_verified_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
      role: primaryRole ? primaryRole.slug : "user",
      role_name: primaryRole ? primaryRole.name : "User",
      permissions,
    };
  });
  const meta = buildPaginationMeta(page, perPage, total);
  sendSuccess(res, 200, "Users list", { items: data, meta });
}

export async function getUserFormOptions(_req: Request, res: Response) {
  const [roles, permissions] = await Promise.all([
    prisma.roles.findMany({
      orderBy: { id: "asc" },
    }),
    prisma.permissions.findMany({
      orderBy: { id: "asc" },
    }),
  ]);
  const data = {
    roles: roles.map((role) => ({
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
    })),
    permissions: permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      slug: permission.slug,
      description: permission.description,
    })),
  };
  sendSuccess(res, 200, "User form options", data);
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  const userId = BigInt(id);
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      user_roles: {
        include: {
          roles: true,
        },
      },
      user_permissions: {
        include: {
          permissions: true,
        },
      },
    },
  });
  if (!user) {
    sendError(res, 404, "User not found");
    return;
  }
  const primaryRole =
    user.user_roles && user.user_roles.length > 0
      ? user.user_roles[0].roles
      : null;
  const permissions =
    user.user_permissions?.map((up) => ({
      id: up.permission_id,
      slug: up.permissions ? up.permissions.slug : null,
    })) ?? [];
  const data = {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    avatar_url: user.avatar
      ? `${process.env.BASE_URL}/api/users/avatar/${user.avatar}`
      : null,
    email_verified_at: user.email_verified_at,
    created_at: user.created_at,
    updated_at: user.updated_at,
    role: primaryRole ? primaryRole.slug : "user",
    role_name: primaryRole ? primaryRole.name : "User",
    role_id: primaryRole ? primaryRole.id : null,
    permissions,
  };
  sendSuccess(res, 200, "User detail", data);
}

export async function updateUserByAdmin(req: Request, res: Response) {
  const { id } = req.params;
  const userId = BigInt(id);
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    sendError(res, 422, "Validation error", errors);
    return;
  }
  const { email, name, password, roleId, permissionIds } = parsed.data;

  const user = await prisma.users.findUnique({
    where: { id: userId },
  });
  if (!user) {
    sendError(res, 404, "User not found");
    return;
  }

  if (email && email !== user.email) {
    const existing = await prisma.users.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });
    if (existing) {
      sendError(res, 409, "Email already used", {
        field: "email",
        message: "Email sudah terdaftar, silakan gunakan email lain",
      });
      return;
    }
  }

  const data: {
    email?: string;
    name?: string;
    password?: string;
    updated_at: Date;
  } = {
    updated_at: new Date(),
  };
  if (typeof email === "string" && email.length > 0) {
    data.email = email;
  }
  if (typeof name === "string" && name.length > 0) {
    data.name = name;
  }
  if (typeof password === "string" && password.length > 0) {
    const hash = await require("bcryptjs").hash(password, 10);
    data.password = hash;
  }

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data,
  });

  let roleSlug = "user";
  if (roleId) {
    const role = await prisma.roles.findUnique({
      where: { id: BigInt(roleId) },
    });
    if (!role) {
      sendError(res, 404, "Role not found");
      return;
    }
    roleSlug = role.slug;
    await prisma.user_roles.deleteMany({
      where: { user_id: userId },
    });
    await prisma.user_roles.create({
      data: {
        user_id: userId,
        role_id: role.id,
        created_at: new Date(),
      },
    });
  } else {
    const existingRole = await prisma.user_roles.findFirst({
      where: { user_id: userId },
      include: { roles: true },
    });
    if (existingRole && existingRole.roles) {
      roleSlug = existingRole.roles.slug;
    }
  }

  if (Array.isArray(permissionIds)) {
    await prisma.user_permissions.deleteMany({
      where: { user_id: userId },
    });
    if (permissionIds.length > 0) {
      const now = new Date();
      const dataPerm = permissionIds.map((pid: string | number) => ({
        user_id: userId,
        permission_id: BigInt(pid),
        created_at: now,
      }));
      await prisma.user_permissions.createMany({
        data: dataPerm,
        skipDuplicates: true,
      });
    }
  }

  sendSuccess(res, 200, "User updated by admin", {
    id: updatedUser.id.toString(),
    email: updatedUser.email,
    name: updatedUser.name,
    role: roleSlug,
  });
}

export async function deleteUserByAdmin(req: Request, res: Response) {
  const { id } = req.params;
  const userId = BigInt(id);

  const user = await prisma.users.findUnique({
    where: { id: userId },
  });
  if (!user) {
    sendError(res, 404, "User not found");
    return;
  }

  await prisma.users.delete({
    where: { id: userId },
  });
  sendSuccess(res, 200, "User deleted by admin", null);
}

export async function adminCreateUser(req: Request, res: Response) {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    sendError(res, 422, "Validation error", errors);
    return;
  }
  const { email, name, password, roleId, permissionIds } = parsed.data;
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) {
    sendError(res, 409, "Email already used", {
      field: "email",
      message: "Email sudah terdaftar, silakan gunakan email lain",
    });
    return;
  }
  let roleSlug = "user";
  let roleIdBigInt: bigint | null = null;
  if (roleId) {
    const role = await prisma.roles.findUnique({
      where: { id: BigInt(roleId) },
    });
    if (!role) {
      sendError(res, 404, "Role not found");
      return;
    }
    roleSlug = role.slug;
    roleIdBigInt = role.id;
  }
  const hash = await require("bcryptjs").hash(password, 10);
  const user = await prisma.users.create({
    data: {
      email,
      name,
      password: hash,
      uuid: require("uuid").v4(),
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  if (roleIdBigInt) {
    await prisma.user_roles.create({
      data: {
        user_id: user.id,
        role_id: roleIdBigInt,
        created_at: new Date(),
      },
    });
  }
  if (Array.isArray(permissionIds) && permissionIds.length > 0) {
    const now = new Date();
    const data = permissionIds.map((pid: string | number) => ({
      user_id: user.id,
      permission_id: BigInt(pid),
      created_at: now,
    }));
    await prisma.user_permissions.createMany({
      data,
      skipDuplicates: true,
    });
  }
  sendSuccess(res, 201, "User created by admin", {
    id: user.id.toString(),
    email: user.email,
    name: user.name,
    role: roleSlug,
  });
}
