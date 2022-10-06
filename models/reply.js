'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
  }, {})
<<<<<<< HEAD
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    Reply.belongsTo(models.User, { foreignKey: 'userId' })
=======

  Reply.associate = function(models) {
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId'})
    Reply.belongsTo(models.User, { foreignKey: 'UserId'})
>>>>>>> master
  }
  Reply.init({
    comment: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true
  })
  return Reply
}
