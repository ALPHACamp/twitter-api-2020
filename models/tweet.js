'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    tableName: 'Tweets'
  })
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
  }
  return Tweet
}
