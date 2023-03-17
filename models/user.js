"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Tweet, { foreignKey: 'userId' })
      User.hasMany(models.Like, {foreignKey: 'userId'})
      User.hasMany(models.Reply, { foreignKey: 'userId'})
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers' // - 透過被追隨者 id 查找粉絲
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings' // - 透過粉絲 id 查找他追蹤的人
      })
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      account: DataTypes.STRING,
      password: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      avatar: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      underscored: true,
    }
  );
  return User;
};
