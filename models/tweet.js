'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
  });
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply, { onDelete: 'cascade', hooks: true })
    Tweet.hasMany(models.Like, { onDelete: 'cascade', hooks: true })
    Tweet.belongsTo(models.User)
  };
  return Tweet;
};