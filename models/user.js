'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    backgroundImage: DataTypes.STRING,
    isAdmin: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.hasMany(models.Followship)
  };
  return User;
};