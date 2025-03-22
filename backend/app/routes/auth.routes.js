// app/routes/auth.routes.js
import express from "express";
import {
  signup,
  signin,
  refreshToken,
} from "../controllers/auth.controller.js";
import { verifySignUp } from "../middlewares/index.js";

const router = express.Router();

// Signup Route
router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  signup
);

// Signin Route
router.post("/signin", signin);

router.post("/refresh-token", refreshToken);

export default router;
