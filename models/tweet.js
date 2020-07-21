'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});
  Tweet.associate = function (models) {
    // associations can be defined here
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
  };
  return Tweet;
};