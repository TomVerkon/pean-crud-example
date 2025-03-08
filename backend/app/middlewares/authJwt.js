// app/middlewares/authJwt.js
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const User = db.user;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  const actualToken = token.startsWith("Bearer ")
    ? token.slice(7, token.length)
    : token;

  jwt.verify(actualToken, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const role of roles) {
      if (role.name === "admin") {
        return next();
      }
    }

    return res.status(403).json({ message: "Require Admin Role!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const role of roles) {
      if (role.name === "moderator") {
        return next();
      }
    }

    return res.status(403).json({ message: "Require Moderator Role!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const role of roles) {
      if (role.name === "moderator" || role.name === "admin") {
        return next();
      }
    }

    return res
      .status(403)
      .json({ message: "Require Moderator or Admin Role!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};

export default authJwt;
