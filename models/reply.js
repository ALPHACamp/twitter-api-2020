'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
      Reply.belongsTo(models.User, { foreignKey: 'userId' })
    }
  };
  Reply.init({
    comment: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Reply'
  });
  return Reply;
};