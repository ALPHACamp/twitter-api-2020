'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Hashtag.belongsToMany(models.Tweet, {
        through: models.TweetHashtag,
        foreignKey: 'hashtagId',
        as: 'TweetsWithHashtags'
      })
    }
  }
  Hashtag.init({
    hashtagText: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Hashtag',
    tableName: 'Hashtags',
    underscored: true,
  });
  return Hashtag;
};