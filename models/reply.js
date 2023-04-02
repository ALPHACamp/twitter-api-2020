'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate (models) {
      Reply.belongsTo(models.User, { foreignKey: 'UserId' })
      Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  }
  Reply.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      comment: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Reply',
      tableName: 'Replies'
    }
  )
  return Reply
}
