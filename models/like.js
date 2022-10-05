'use strict'
const Sequelize = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    UserId: {
      type: Sequelize.INTEGER
    },
    TweetId: {
      type: Sequelize.INTEGER
    }
  }, {
    tableName: 'Likes',
    timestamps: true,
    paranoid: true, // 軟刪除
    underscored: true
  })
  Like.associate = function (models) {
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  }
  return Like
}
