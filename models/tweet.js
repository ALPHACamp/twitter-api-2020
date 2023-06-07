'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {});
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    Tweet.belongsToMany(models.User, {
      through: models.Like, // 透過 Favorite 表來建立關聯
      foreignKey: 'tweetId', // 對 Favorite 表設定 FK
      as: 'LikedUsers' // 幫這個關聯取個名稱
    })
  };
  Tweet.init({
    description: DataTypes.TEXT,
    numberLike: DataTypes.INTEGER,
    numberUnlike: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
  })
  return Tweet;
};