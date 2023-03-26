'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {}, {})
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    Reply.belongsTo(models.User, { foreignKey: 'UserId' })
  }
  Reply.init({
    comment: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true
  })
  return Reply
}
