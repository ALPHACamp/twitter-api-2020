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
    userId: DataTypes.INTEGER,
    replyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LikedReply',
    tableName: 'Liked_replies',
    underscored: true
  })
  return LikedReply;
}