'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    'Tweet',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  )
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Like)
    Tweet.hasMany(models.Reply)
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
