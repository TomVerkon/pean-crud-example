// app/models/user.model.js
export default (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
    },
  });

  return User;
};
