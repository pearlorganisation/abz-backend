import express from "express";
import {
  login,
  logout,
  register,
  verifySignUpToken,
} from "../controllers/auth/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middlware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify-signup/:token").get(verifySignUpToken);
router.route("/logout").post(authenticateToken, logout);

export default router;
