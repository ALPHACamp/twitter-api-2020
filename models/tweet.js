'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {});
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Like, {foreignKey: 'tweetId'})
    Tweet.hasMany(models.Reply, {foreignKey: 'tweetId'})
    Tweet.belongsTo(models.User, {foreignKey: 'userId'})
  };
  Tweet.init({
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet;
};