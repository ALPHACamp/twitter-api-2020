'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    // id: {
    //   primaryKey: true,
    //   autoIncrement: true,
    //   type: DataTypes.INTEGER
    // },
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet'
  })
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)

    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })

    Tweet.belongsToMany(models.User, {
      through: models.Reply,
      foreignKey: 'UserId',
      as: 'ReplyUsers'
    })
  }
  return Tweet
}
