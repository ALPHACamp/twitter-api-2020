'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true
  })
  Reply.associate = function (models) {
    Reply.belongsTo(models.User, { foreignKey: 'userId' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
  }
  return Reply
}
