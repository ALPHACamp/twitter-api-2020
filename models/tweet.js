'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {}, {})
  Tweet.associate = function (models) {
    // When deleting a tweet, the related like and reply will be deleted at the same time
    Tweet.hasMany(models.Like, { onDelete: 'cascade', hooks: true })
    Tweet.hasMany(models.Reply, { onDelete: 'cascade', hooks: true })

    Tweet.belongsTo(models.User)
  }
  return Tweet
}
