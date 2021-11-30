'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
  }, {});
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    // 待確認是否需要LikedUsers 或增加Tweet欄位likesCount
    // Tweet.belongsToMany(models.User, { 
    //   through: models.Like,
    //   foreignKey: 'TweetId',
    //   as: 'LikedUsers'
    // })
  };
  return Tweet;
};