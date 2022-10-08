'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate(models) {
      // define association here
      Reply.belongsTo(models.Tweet, { foreignKey: "tweetId" })
      Reply.belongsTo(models.User, { foreignKey: "userId" })
    }
  }
  Reply.init({
    comment: DataTypes.TEXT,
    tweetId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true
  })
  return Reply
}