'use strict'
const { datatype } = require('faker')
const {
  Model
} = require('sequelize');
const tweet = require('./tweet');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING(50),
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT(160),
    role: DataTypes.STRING,
    account: DataTypes.STRING,
    cover: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
<<<<<<< HEAD
    User.belongsToMany(models.User, {
=======
    User.belongsToMany(User, {
>>>>>>> origin/master
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
<<<<<<< HEAD
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
=======
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followersId',
>>>>>>> origin/master
      as: 'Followings'
    })
  }

  return User;
};