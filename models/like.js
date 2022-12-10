'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate (models) {
      // Relation(s)
      Like.belongsTo(models.User, { foreignKey: 'userId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    }
  }
  Like.init({
    // field: DataTypes.TYPE
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'
  })
  return Like
}
