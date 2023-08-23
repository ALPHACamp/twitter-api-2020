'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Like extends Model { }

  Like.associate = function (models) {
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  }

  Like.init({
    id: {
      field: 'id',
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: false
  })

  return Like
}
