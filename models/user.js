'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING
    },
    introduction: {
      type: DataTypes.TEXT
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    backgroundImage: {
      type: DataTypes.STRING
    }
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.hasMany(models.Followship)
  };
  return User;
};