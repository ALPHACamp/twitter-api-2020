'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER
  }, {
    tableName: 'Likes'
  });
  Like.associate = function(models) {
    Like.belongsTo(models.User, { foreignKey: 'userId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
  };
  return Like;
};