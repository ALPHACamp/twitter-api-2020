'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
      avatar: {
        type: DataTypes.STRING,
        defaultValue: "https://i.imgur.com/q6bwDGO.png",
      },
      introduction: DataTypes.STRING,
      account: {
        type: DataTypes.STRING,
        unique: true
      },
      cover: {
        type: DataTypes.STRING,
        defaultValue: "https://i.imgur.com/1jDf2Me.png",
      },
      followerCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      followingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {}
  );
  User.associate = function(models) {
    User.hasMany(models.Tweet);
    User.hasMany(models.Reply);
    User.hasMany(models.Like);

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
  };
  return User;
};