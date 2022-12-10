'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate (models) {
      // Relation(s)
      Reply.belongsTo(models.User, { foreignKey: 'userId' })
      Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    }
  }
  Reply.init({
    // field: DataTypes.TYPE
    comment: DataTypes.TEXT,
    tweetId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies'
  })
  return Reply
}
