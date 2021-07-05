'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Like.belongsTo(models.User)
      Like.belongsTo(models.Tweet)
    }
  };
  Like.init({
    isTweet: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    ContentLikedId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};