
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    // id: { type: DataTypes.INTEGER, primaryKey: true },
    description: DataTypes.TEXT

  }, {});
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    Tweet.belongsTo(models.User)

  };

  return Tweet;
};

