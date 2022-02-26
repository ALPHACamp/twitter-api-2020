'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    totalLikes: DataTypes.INTEGER,
    totalReplies: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'Tweets'
  });
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
    Tweet.belongsTo(models.User, { foreignKey: 'UserId', as: 'tweetedUser' })
    Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'UsersFromLikedTweets'
    })
  };
  return Tweet;
};