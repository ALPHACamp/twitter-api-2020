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

    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikeUser'
    })

    Tweet.belongsToMany(models.User, {
      through: models.Reply,
      foreignKey: 'TweetId',
      as: 'ReplyUser'
    })
  }
  return Tweet
}