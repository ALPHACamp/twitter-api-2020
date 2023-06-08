'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {});
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User,
      { foreignKey: 'UserId' })
    Tweet.hasMany(models.Reply,
      { foreignKey: 'TweetId' })
    Tweet.hasMany(models.Like,
      { foreignKey: 'TweetId' })
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    likable: DataTypes.BOOLEAN,
    commendable: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet;
};