'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    Tweet.belongsToMany(models.Like, {
      through: models.Like,
      foreignKey: 'tweetId',
      as: 'LikedUser'
    })
  }
  return Tweet
}
