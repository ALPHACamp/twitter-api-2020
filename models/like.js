'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    TweetId: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'Likes',
    timestamps: true,
    paranoid: true, // 軟刪除
    underscored: true
  })
  Like.associate = function (models) {
  }
  return Like
}
