'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Reply.belongsTo(models.User, { foreignKey: 'userId' })
      Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
      Reply.hasMany(models.ReplyLike, { foreignKey: 'replyId' })
    }
  }
  Reply.init({
    replyText: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true
  })
  return Reply
}
