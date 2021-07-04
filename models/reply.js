"use strict"
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    "Reply",
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {}
  )
  Reply.associate = function (models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  }
  return Reply
}
