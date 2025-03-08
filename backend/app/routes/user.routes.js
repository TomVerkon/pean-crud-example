// app/routes/user.routes.js
import express from "express";
import {
  allAccess,
  userBoard,
  moderatorBoard,
  adminBoard,
} from "../controllers/user.controller.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

// Public Route
router.get("/all", allAccess);

// User Route
router.get("/user", [authJwt.verifyToken], userBoard);

// Moderator Route
router.get("/mod", [authJwt.verifyToken, authJwt.isModerator], moderatorBoard);

// Admin Route
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);

export default router;
