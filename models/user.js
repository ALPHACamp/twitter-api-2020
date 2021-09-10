'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    account: DataTypes.STRING,
    cover: DataTypes.STRING,
    avatar: { type: DataTypes.STRING, defaultValue: 'https://image.flaticon.com/icons/png/512/149/149071.png' },
    introduction: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: 'user' },
  }, {});
  User.associate = function (models) {
  };
  return User;
};