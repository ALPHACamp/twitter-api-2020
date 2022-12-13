'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {

    static associate(models) {
      // 和Tweet的關聯
      Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
      // 和User的關聯
      Reply.belongsTo(models.User, {
        foreignKey: 'UserId'  
      })
    }
  }
  Reply.init({
    TweetId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true
  })
  return Reply
}