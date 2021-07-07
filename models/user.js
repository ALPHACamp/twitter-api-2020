"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      account: {
        type: DataTypes.STRING,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      cover: {
        type: DataTypes.STRING,
      },
      introduction: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      likeNum: {
        type: DataTypes.INTEGER,
      },
      tweetNum: {
        type: DataTypes.INTEGER,
      },
      followingNum: {
        type: DataTypes.INTEGER,
      },
      followerNum: {
        type: DataTypes.INTEGER,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
      },
    },
    {}
  );
  User.associate = function (models) {
    User.hasMany(models.Like);
    User.hasMany(models.Reply);
    User.hasMany(models.Tweet, { foreignKey: "UserId", as: "User" } );
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: "followingId",
      as: "Followers",
    });
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: "followerId",
      as: "Followings",
    });
    User.belongsToMany(models.Tweet, { through: models.Like, foreignKey: "UserId", as: "LikedTweets", })
  };
  return User;
};
