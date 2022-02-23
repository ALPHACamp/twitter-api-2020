'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets', 
  });
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
  };
  return Tweet;
};