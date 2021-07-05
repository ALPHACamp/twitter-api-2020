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
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING(140),
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      likeNum: {
        type: DataTypes.INTEGER,
      },
      replyNum: {
        type: DataTypes.INTEGER,
      },
      AdminId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {}
  );
  Tweet.associate = function (models) {};
  return Tweet;
};
