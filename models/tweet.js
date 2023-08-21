const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model { }

  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'tweetId',
      as: 'LikedUser'
    })
  }

  Tweet.init({
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: false
  })

  return Tweet
}
