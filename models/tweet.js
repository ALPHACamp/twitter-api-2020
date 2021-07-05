'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tweet.belongsTo(models.User)
      Tweet.hasMany(models.Like)
      Tweet.hasMany(models.Reply)
    }
  };
  Tweet.init({
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
  });
  return Tweet;
};