import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  me,
  logout,
  refreshToken,
} from "../../controllers/authController";
import { requireAuth } from "../../middleware/auth";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRouter = Router();

authRouter.post("/register", authLimiter, register);

authRouter.post("/login", authLimiter, login);

authRouter.get("/me", requireAuth, me);

authRouter.post("/logout", requireAuth, logout);

authRouter.post("/refresh", authLimiter, refreshToken);
