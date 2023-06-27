'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId', onDelete: 'CASCADE', hooks: 'true' })
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId', onDelete: 'CASCADE', hooks: 'true' })
    }
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Tweet'
  });
  return Tweet;
};