'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {

  class Like extends Model {

    static associate (models) {
    Like.belongsTo(models.User, { foreignKey: 'userId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    }  
  }
  Like.init({
    // Model attributes are defined here
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Like', // We need to choose the model name
    tableName: 'Likes',
    underscored: true
  })
  return Like
}