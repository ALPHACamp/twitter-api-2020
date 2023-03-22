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
      Like.belongsTo(models.User, { foreignKey: 'userId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
      Like.belongsTo(models.Reply, { foreignKey: 'replyId' })
    }
  }
  Like.init({
    UserId: DataTypes.INTEGER, // 暫時配合測試檔，改大駝峰
    TweetId: DataTypes.INTEGER // 暫時配合測試檔，改大駝峰
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true
  })
  return Like
}
