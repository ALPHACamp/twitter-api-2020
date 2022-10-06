'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
<<<<<<< HEAD
  }, {})
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
  }
=======
  }, {});
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Like, {foreignKey: 'TweetId'})
    Tweet.hasMany(models.Reply, {foreignKey: 'TweetId'})
    Tweet.belongsTo(models.User, {foreignKey: 'UserId'})
  };

>>>>>>> master
  Tweet.init({
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}
