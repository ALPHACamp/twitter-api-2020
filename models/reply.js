'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
  }, {})
  Reply.associate = function (models) {
    Reply.belongsTo(models.User, { foreignKey: 'UserId' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  }
  Reply.init({
    comment: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies'
  })

  return Reply
}
