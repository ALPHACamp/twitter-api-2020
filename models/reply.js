'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate (models) {
      Reply.belongsTo(models.User, { foreignKey: 'userId' })
      Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    }
  }
  Reply.init({
    // Model attributes are defined here
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Reply', // We need to choose the model name
    tableName: 'Replies',
    underscored: true
  })
  return Reply
}
