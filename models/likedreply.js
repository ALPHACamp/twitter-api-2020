'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class LikedReply extends Model {
    static associate (models) {
      LikedReply.belongsTo(models.User, { foreignKey: 'UserId' })
      LikedReply.belongsTo(models.Reply, { foreignKey: 'ReplyId' })
    }
  };
  LikedReply.init({
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
