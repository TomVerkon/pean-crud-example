// app/routes/auth.routes.js
import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";
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

export default router;
