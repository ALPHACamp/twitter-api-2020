'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TweetId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Like.associate = function (models) {
    // associations can be defined here
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
  };
  return Like;
};