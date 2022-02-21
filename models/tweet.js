'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  });
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
  };
  return Tweet;
};