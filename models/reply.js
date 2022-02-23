'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    userId: DataTypes.STRING,
    tweetId: DataTypes.STRING,
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {})
  Reply.associate = function(models) {
    Reply.belongsTo(models.User, { foreignKey: 'UserId' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  }
  return Reply
}