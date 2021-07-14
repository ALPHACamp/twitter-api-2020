'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    isLike: {
      type: DataTypes.VIRTUAL,
      get: function() {
        return !!this.getDataValue('isLike')
      }
    }
  }, {})
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Like, { onDelete: 'CASCADE' })
    Tweet.hasMany(models.Reply, { onDelete: 'CASCADE' })

    Tweet.belongsTo(models.User)
  }
  return Tweet
}
