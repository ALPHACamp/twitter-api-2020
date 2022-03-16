'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'
  });
  Like.associate = function (models) {
    Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    Like.belongsTo(models.User, { foreignKey: 'userId' })
  };
  return Like;
};