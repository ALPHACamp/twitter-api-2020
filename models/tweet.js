'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    modelName: 'Tweet',
    tableName: 'Tweets',
  });
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
  };
  return Tweet;
};