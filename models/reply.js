'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'Reply',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      TweetId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    { sequelize, modelName: 'Reply', tableName: 'Replies', underscored: true, timestamps: false }
  )
  Reply.associate = function (models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  }
  return Reply
}
