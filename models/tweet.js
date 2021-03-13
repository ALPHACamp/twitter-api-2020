'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: {
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {})
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply, { onDelete: 'cascade' })
    Tweet.hasMany(models.Like, { onDelete: 'cascade' })
  }
  return Tweet
}
