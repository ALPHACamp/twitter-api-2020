'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class LikedReply extends Model {
    static associate (models) {

    }
  };
  LikedReply.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    UserId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'LikedReply',
    tableName: 'Liked_replies',
    underscored: true
  })
  return LikedReply
}
