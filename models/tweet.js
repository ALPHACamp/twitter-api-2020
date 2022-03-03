'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  });
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
  };
  return Tweet;
};