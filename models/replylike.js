'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ReplyLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      ReplyLike.belongsTo(models.User, { foreignKey: 'userId' })
      ReplyLike.belongsTo(models.Reply, { foreignKey: 'replyId' })
    }
  }
  ReplyLike.init({
    likeUnlike: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    replyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReplyLike',
    tableName: 'ReplyLikes',
    underscored: true
  })
  return ReplyLike
}
