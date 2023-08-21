'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    account: DataTypes.STRING
  }, {
    modelName: 'User',
    tableName: 'Users',
  });
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
  };
  return User;
};