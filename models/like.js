'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes', 
  });
  Like.associate = function(models) {
    Like.belongsTo(models.User, { foreignkey: 'userId' })
    Like.belongsTo(models.Tweet, { foreignkey: 'tweetId' })
  };
  return Like;
};