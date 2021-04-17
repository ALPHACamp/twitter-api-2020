'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'Reply',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      comment: DataTypes.STRING
    },
    {}
  )
  Reply.associate = function (models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  }
  return Reply
}
