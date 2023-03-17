'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate (models) {
      Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
      Reply.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Reply.init({
    comment: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true
  })
  return Reply
}
