'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {})
  User.associate = function (models) {
  }
  return User
}
