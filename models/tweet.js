"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    "Tweet",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: {
        type: DataTypes.INTEGER,
      },
      description: {
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
      replyNum: {
        type: DataTypes.INTEGER,
      }
    },
    {}
  );
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply);
    Tweet.hasMany(models.Like);
    Tweet.belongsTo(models.User, { foreignKey: "UserId", as: "Author"})
    Tweet.belongsTo(models.Admin);
    Tweet.belongsToMany(models.User, { through: models.Like, foreignKey: "TweetId", as: "LikedUsers", })
  };
  return Tweet;
};
