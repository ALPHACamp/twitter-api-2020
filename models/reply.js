'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    comment: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true
  })
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    Reply.belongsTo(models.User, { foreignKey: 'userId' })
  }
  return Reply
}
