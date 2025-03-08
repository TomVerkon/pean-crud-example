// app/models/index.js
import Sequelize from "sequelize";
import dbConfig from "../config/db.config.js";
import UserModel from "./user.model.js";
import RoleModel from "./role.model.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = UserModel(sequelize, Sequelize);
db.role = RoleModel(sequelize, Sequelize);

db.role.belongsToMany(db.user, { through: "user_roles" });
db.user.belongsToMany(db.role, { through: "user_roles", as: "roles" });

db.ROLES = ["user", "admin", "moderator"];

export default db;
