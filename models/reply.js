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
      // define association here
      Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
      Reply.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  };
  Reply.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replys'
  })
  return Reply
}
