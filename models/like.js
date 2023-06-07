'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
  }, {});
  Like.associate = function(models) {
  };
  // Like.init({
  //   userId: DataTypes.INTEGER, 
  //   tweetId: DataTypes.INTEGER 
  // }, {
  //   sequelize,
  //   modelName: 'Like',
  //   tableName: 'Likes', // 新增這裡
  //   underscored: true
  // })
  return Like;
};