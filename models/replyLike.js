'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ReplyLike extends Model {
    static associate (models) {
      ReplyLike.belongsTo(models.User, { foreignKey: 'UserId' })
      ReplyLike.belongsTo(models.Reply, { foreignKey: 'ReplyId' })
    }
  };
  ReplyLike.init({
    UserId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReplyLike',
    tableName: 'ReplyLikes',
    underscored: true
  })
  return ReplyLike
}
