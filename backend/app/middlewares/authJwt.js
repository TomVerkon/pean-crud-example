// app/middlewares/authJwt.js
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const User = db.user;

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, authConfig.refreshSecret, {
    expiresIn: "7d",
  });
};

// Example: Issue tokens during login
const login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password (implement bcrypt.compare here)

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refreshToken in DB (or HTTP-only cookie)
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;

  jwt.verify(actualToken, authConfig.secret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Token expired or invalid." });
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

const isUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const role of roles) {
      if (role.name === "user") {
        return next();
      }
    }

    return res.status(403).json({ message: "Require User Role!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const isModeratorOrAdmin = async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.userId);
//     const roles = await user.getRoles();

//     for (const role of roles) {
//       if (role.name === "moderator" || role.name === "admin") {
//         return next();
//       }
//     }

//     return res
//       .status(403)
//       .json({ message: "Require Moderator or Admin Role!" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const authJwt = {
  verifyToken,
  isAdmin,
  isUser,
};

export default authJwt;
