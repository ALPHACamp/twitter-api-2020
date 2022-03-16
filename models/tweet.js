'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    UserId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    likeCount: DataTypes.INTEGER,
    replyCount: DataTypes.INTEGER
  }, {
    tableName: 'Tweets'
  })
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
    // Tweet.belongsTo(models.User, { foreignKey: 'UserId' , as: "TweetAuthor"})
    Tweet.belongsTo(models.User, { foreignKey: 'UserId'})
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })
    Tweet.belongsToMany(models.User, {
      through: models.Reply,
      foreignKey: 'TweetId',
      as: 'RepliedUsers'
    })
  }
  return Tweet
}