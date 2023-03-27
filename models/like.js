'use strict'
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Like.belongsTo(models.User, { foreignKey: 'UserId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
      Like.belongsTo(models.Reply, { foreignKey: 'ReplyId' })
    }
  }
  Like.init({
    UserId: DataTypes.INTEGER, // 暫時配合測試檔，改大駝峰
    TweetId: DataTypes.INTEGER, // 暫時配合測試檔，改大駝峰
    ReplyId: DataTypes.INTEGER // 暫時配合測試檔，改大駝峰
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true
  })
  return Like
}
