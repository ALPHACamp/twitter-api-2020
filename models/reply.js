'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    comment: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER
  }, {
    tableName: 'Replies'
  })
  Reply.associate = function (models) {
    Reply.belongsTo(models.User, { foreignKey: 'userId' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
  }
  return Reply
}
