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
      Tweet.belongsTo(model.User, { foreignKey: 'userId'})
    }
  };
  Tweet.init({
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true,
  });
  return Tweet;
};