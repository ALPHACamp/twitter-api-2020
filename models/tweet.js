'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true  
  });
  Tweet.associate = function(models) {
    Tweet.hasMany(model.Reply, { foreignKey: 'tweetId' })
    Tweet.hasMany(model.Like, { foreignKey: 'tweetId' })
    Tweet.belongsTo(model.User, { foreignKey: 'userId' })
  };
  return Tweet;
};