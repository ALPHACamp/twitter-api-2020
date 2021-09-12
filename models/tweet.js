'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {});
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Like, { onDelete: "cascade", hooks: true });
    Tweet.hasMany(models.Reply, { onDelete: "cascade", hooks: true });

    Tweet.belongsTo(models.User);
  };
  return Tweet;
};