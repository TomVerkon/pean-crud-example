// app/controllers/auth.controller.js
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = db.user;
const Role = db.role;

export const signup = async (req, res) => {
  try {
    // Create new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const role = await Role.findOne({ where: { name: "user" } });
    await user.setRoles([role]);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User Not found." });
    }

    // Validate password
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400, // 24 hours
    });

    // Get user roles
    const roles = await user.getRoles();
    const authorities = roles.map((role) => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
