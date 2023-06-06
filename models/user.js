'use strict';

const { dataTypes } = require("sequelize-test-helpers");
const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Reply,
      { foreignKey: 'UserId' })
    User.hasMany(models.Tweet,
      { foreignKey: 'UserId' })
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    })
    User.belongsToMany(models.Reply, {
      through: models.Tweet,
      foreignKey: 'UserId',
      as: 'RepliedTweets'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
  };
  User.init({
    account: dataTypes.STRING,
    name: dataTypes.STRING,
    email: dataTypes.STRING,
    password: dataTypes.STRING,
    introduction: dataTypes.TEXT,
    telephone: dataTypes.STRING,
    avatar: dataTypes.STRING,
    coverPhoto: dataTypes.STRING,
    role: dataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User;
};