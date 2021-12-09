'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'Reply',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: {
        type: DataTypes.INTEGER,
      },
      TweetId: {
        type: DataTypes.INTEGER,
      },
      comment: {
        type: DataTypes.TEXT,
      },
    },
    {}
  )
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet)
    Reply.belongsTo(models.User)
  }
  return Reply
}