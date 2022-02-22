'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    avatar: {
      type: Sequelize.STRING
    },
    introduction: {
      type: Sequelize.TEXT
    },
    role: {
      type: Sequelize.STRING
    }
  }, {});
  User.associate = function (models) {
  };
  return User;
};