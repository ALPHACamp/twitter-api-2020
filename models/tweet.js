'use strict';
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.hasMany(models.Like, {foreignKey: 'TweetId'})
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId'})
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Tweet.init(
    {
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Tweet",
      tableName: "Tweets",
    }
  );
  return Tweet;
};