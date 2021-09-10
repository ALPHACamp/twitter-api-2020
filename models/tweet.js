'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {});
  Tweet.associate = function (models) {
  };
  return Tweet;
};