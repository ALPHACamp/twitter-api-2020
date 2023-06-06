'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'Reply',
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      comment: DataTypes.TEXT
    },
    {
      modelName: 'Reply',
      tableName: 'Replies'
    }
  )
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    Reply.belongsTo(models.User, { foreignKey: 'UserId' })
  }
  return Reply
}
