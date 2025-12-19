import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import {
  listUsers,
  getUserById,
  adminCreateUser,
  updateUserByAdmin,
  deleteUserByAdmin,
  getUserFormOptions,
} from "../controllers/userController";

export const userRouter = Router();

userRouter.get("/options", requireAuth, requireAdmin, getUserFormOptions);
userRouter.get("/", requireAuth, requireAdmin, listUsers);
userRouter.get("/:id", requireAuth, requireAdmin, getUserById);
userRouter.post("/", requireAuth, requireAdmin, adminCreateUser);
userRouter.put("/:id", requireAuth, requireAdmin, updateUserByAdmin);
userRouter.delete("/:id", requireAuth, requireAdmin, deleteUserByAdmin);
