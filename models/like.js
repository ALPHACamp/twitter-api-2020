'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER
  }, {
    modelName: 'Like',
    tableName: 'Likes'
  });
  Like.associate = function(models) {
  };
  return Like;
};