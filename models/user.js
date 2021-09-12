'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
      },
      avatar: {
        type: DataTypes.STRING,
        defaultValue: "https://i.imgur.com/q6bwDGO.png",
      },
      introduction: DataTypes.STRING,
      account: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
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