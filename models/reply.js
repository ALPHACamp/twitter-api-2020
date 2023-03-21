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
      Reply.belongsTo(model.User, { foreignKey: "userId" })
      Reply.belongsTo(model.Tweet, { foreignKey: "tweetId" })
    }
  };
  Reply.init({
    comment: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    tweet_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true,
  });
  return Reply;
};