import { prisma } from "../src/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

async function main() {
  console.log("Start seeding...");

  // 1. Create Users (Super Admin, Admin & User)
  const passwordHash = await bcrypt.hash("string", 10);

  const superAdmin = await prisma.users.upsert({
    where: { email: "sa@sa.com" },
    update: {},
    create: {
      uuid: uuidv4(),
      name: "Super Admin",
      email: "sa@sa.com",
      password: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  console.log(`Created super admin: ${superAdmin.name}`);

  const admin = await prisma.users.upsert({
    where: { email: "a@a.com" },
    update: {},
    create: {
      uuid: uuidv4(),
      name: "Admin User",
      email: "a@a.com",
      password: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  console.log(`Created admin: ${admin.name}`);

  const user = await prisma.users.upsert({
    where: { email: "u@u.com" },
    update: {},
    create: {
      uuid: uuidv4(),
      name: "Regular User",
      email: "u@u.com",
      password: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  console.log(`Created user: ${user.name}`);

  // 2. Seed Roles
  const superAdminRole = await prisma.roles.upsert({
    where: { slug: "super_admin" },
    update: {},
    create: {
      name: "Super Admin",
      slug: "super_admin",
      description: "Full access to all resources",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const adminRole = await prisma.roles.upsert({
    where: { slug: "admin" },
    update: {},
    create: {
      name: "Admin",
      slug: "admin",
      description: "Administrator",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const userRole = await prisma.roles.upsert({
    where: { slug: "user" },
    update: {},
    create: {
      name: "User",
      slug: "user",
      description: "Regular user",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  console.log("Seeded roles");

  // 3. Seed Permissions
  const manageUsers = await prisma.permissions.upsert({
    where: { slug: "users.manage" },
    update: {},
    create: {
      name: "Manage Users",
      slug: "users.manage",
      description: "Create, update, and delete users",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  const manageUsersCreate = await prisma.permissions.upsert({
    where: { slug: "users.create" },
    update: {},
    create: {
      name: "Create Users",
      slug: "users.create",
      description: "Create users",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  const manageUsersView = await prisma.permissions.upsert({
    where: { slug: "users.view" },
    update: {},
    create: {
      name: "View Users",
      slug: "users.view",
      description: "View users",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  const manageUsersUpdate = await prisma.permissions.upsert({
    where: { slug: "users.update" },
    update: {},
    create: {
      name: "Update Users",
      slug: "users.update",
      description: "Update users",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  const manageUsersDelete = await prisma.permissions.upsert({
    where: { slug: "users.delete" },
    update: {},
    create: {
      name: "Delete Users",
      slug: "users.delete",
      description: "Delete users",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const manageRoles = await prisma.permissions.upsert({
    where: { slug: "roles.manage" },
    update: {},
    create: {
      name: "Manage Roles",
      slug: "roles.manage",
      description: "Create, update, and delete roles",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const managePermissions = await prisma.permissions.upsert({
    where: { slug: "permissions.manage" },
    update: {},
    create: {
      name: "Manage Permissions",
      slug: "permissions.manage",
      description: "Create, update, and delete permissions",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const manageProfiles = await prisma.permissions.upsert({
    where: { slug: "profiles.manage" },
    update: {},
    create: {
      name: "Manage Profiles",
      slug: "profiles.manage",
      description: "Manage user profiles",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  console.log("Seeded permissions");

  // 4. Assign permissions to roles
  const postsCreate = await prisma.permissions.upsert({
    where: { slug: "posts.create" },
    update: {},
    create: {
      name: "Create Posts",
      slug: "posts.create",
      description: "Create posts",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const postsUpdate = await prisma.permissions.upsert({
    where: { slug: "posts.update" },
    update: {},
    create: {
      name: "Update Posts",
      slug: "posts.update",
      description: "Update posts",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const postsDelete = await prisma.permissions.upsert({
    where: { slug: "posts.delete" },
    update: {},
    create: {
      name: "Delete Posts",
      slug: "posts.delete",
      description: "Delete posts",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const postsView = await prisma.permissions.upsert({
    where: { slug: "posts.view" },
    update: {},
    create: {
      name: "View Posts",
      slug: "posts.view",
      description: "View posts",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const categoriesManage = await prisma.permissions.upsert({
    where: { slug: "categories.manage" },
    update: {},
    create: {
      name: "Manage Categories",
      slug: "categories.manage",
      description: "Manage categories",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const commentsManage = await prisma.permissions.upsert({
    where: { slug: "comments.manage" },
    update: {},
    create: {
      name: "Manage Comments",
      slug: "comments.manage",
      description: "Manage comments",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  console.log("Seeded resource permissions");

  // 4. Assign permissions to roles
  const rolePermPairs: { roleId: bigint; permId: bigint }[] = [
    // super_admin gets all users permissions + other management permissions
    { roleId: superAdminRole.id, permId: manageUsers.id },
    { roleId: superAdminRole.id, permId: manageUsersCreate.id },
    { roleId: superAdminRole.id, permId: manageUsersView.id },
    { roleId: superAdminRole.id, permId: manageUsersUpdate.id },
    { roleId: superAdminRole.id, permId: manageUsersDelete.id },
    { roleId: superAdminRole.id, permId: manageRoles.id },
    { roleId: superAdminRole.id, permId: managePermissions.id },
    { roleId: superAdminRole.id, permId: manageProfiles.id },
    { roleId: superAdminRole.id, permId: postsCreate.id },
    { roleId: superAdminRole.id, permId: postsUpdate.id },
    { roleId: superAdminRole.id, permId: postsDelete.id },
    { roleId: superAdminRole.id, permId: postsView.id },
    { roleId: superAdminRole.id, permId: categoriesManage.id },
    { roleId: superAdminRole.id, permId: commentsManage.id },
    // admin gets users permissions except delete
    { roleId: adminRole.id, permId: manageUsersCreate.id },
    { roleId: adminRole.id, permId: manageUsersView.id },
    { roleId: adminRole.id, permId: manageUsersUpdate.id },
    // admin gets other management permissions
    { roleId: adminRole.id, permId: manageRoles.id },
    { roleId: adminRole.id, permId: managePermissions.id },
    { roleId: adminRole.id, permId: postsCreate.id },
    { roleId: adminRole.id, permId: postsUpdate.id },
    { roleId: adminRole.id, permId: postsDelete.id },
    { roleId: adminRole.id, permId: postsView.id },
    { roleId: adminRole.id, permId: categoriesManage.id },
    { roleId: adminRole.id, permId: commentsManage.id },
    // user gets read-only posts
    { roleId: userRole.id, permId: postsView.id },
  ];

  for (const pair of rolePermPairs) {
    await prisma.role_permissions.upsert({
      where: {
        role_id_permission_id: {
          role_id: pair.roleId,
          permission_id: pair.permId,
        },
      },
      create: {
        role_id: pair.roleId,
        permission_id: pair.permId,
        created_at: new Date(),
      },
      update: {},
    });
  }

  console.log("Assigned permissions to roles");

  // 5. Assign roles to users
  const userRolePairs: { userId: bigint; roleId: bigint }[] = [
    { userId: superAdmin.id, roleId: superAdminRole.id },
    { userId: admin.id, roleId: adminRole.id },
    { userId: user.id, roleId: userRole.id },
  ];

  for (const pair of userRolePairs) {
    await prisma.user_roles.upsert({
      where: {
        user_id_role_id: {
          user_id: pair.userId,
          role_id: pair.roleId,
        },
      },
      create: {
        user_id: pair.userId,
        role_id: pair.roleId,
        created_at: new Date(),
      },
      update: {},
    });
  }

  console.log("Assigned roles to users");

  const indoCities = [
    "Jakarta",
    "Bandung",
    "Surabaya",
    "Yogyakarta",
    "Semarang",
    "Medan",
    "Makassar",
    "Denpasar",
    "Palembang",
    "Bogor",
  ];

  const indoProvinces = [
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Timur",
    "DI Yogyakarta",
    "Jawa Tengah",
    "Sumatera Utara",
    "Sulawesi Selatan",
    "Bali",
    "Sumatera Selatan",
    "Jawa Barat",
  ];

  const maritalStatuses = ["single", "married", "married", "single"];
  const genders = ["male", "female"];

  const sampleProfileCount = 50;

  for (let i = 1; i <= sampleProfileCount; i++) {
    const name = `Orang Indonesia ${i}`;
    const email = `orang${i}@example.id`;
    const username = `orang${i}`;

    const userRecord = await prisma.users.upsert({
      where: { email },
      update: {},
      create: {
        uuid: uuidv4(),
        name,
        email,
        password: passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    await prisma.user_roles.upsert({
      where: {
        user_id_role_id: {
          user_id: userRecord.id,
          role_id: userRole.id,
        },
      },
      create: {
        user_id: userRecord.id,
        role_id: userRole.id,
        created_at: new Date(),
      },
      update: {},
    });

    const city = indoCities[(i - 1) % indoCities.length];
    const province = indoProvinces[(i - 1) % indoProvinces.length];
    const marital_status = maritalStatuses[(i - 1) % maritalStatuses.length];
    const gender = genders[(i - 1) % genders.length];

    const slugBase = slugify(name, { lower: true });
    const slug = `${slugBase}-${i}`;

    const dobYear = 1985 + ((i - 1) % 15);
    const dobMonth = (i - 1) % 12;
    const dobDay = ((i - 1) % 28) + 1;

    const nik = `3174${(100000000000 + i).toString()}`;
    const kk = `3175${(200000000000 + i).toString()}`;
    const phone = `+62812${(10000000 + i).toString().padStart(8, "0")}`;
    const whatsapp = `+62813${(10000000 + i).toString().padStart(8, "0")}`;
    const postal_code = (10000 + i).toString();

    await prisma.profile_users.upsert({
      where: { slug },
      update: {
        user_id: userRecord.id,
      },
      create: {
        uuid: uuidv4(),
        user_id: userRecord.id,
        name,
        slug,
        image: null,
        image_url: null,
        status: "published",
        views: "0",
        tags: "indonesia,profile",
        description: `Profil pengguna Indonesia nomor ${i}`,
        username,
        gender,
        date_of_birth: new Date(dobYear, dobMonth, dobDay),
        marital_status,
        nik,
        kk,
        phone,
        whatsapp,
        address: `Jl. Contoh Nomor ${i}`,
        city,
        state: province,
        country: "Indonesia",
        postal_code,
        website: `https://example.com/orang-${i}`,
        facebook: `https://facebook.com/orang${i}`,
        instagram: `https://instagram.com/orang${i}`,
        twitter: `https://twitter.com/orang${i}`,
        linkedin: `https://linkedin.com/in/orang${i}`,
        youtube: `https://youtube.com/@orang${i}`,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
