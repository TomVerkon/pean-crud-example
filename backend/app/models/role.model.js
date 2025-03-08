// app/models/role.model.js
export default (sequelize, DataTypes) => {
  const Role = sequelize.define("roles", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  });

  return Role;
};
