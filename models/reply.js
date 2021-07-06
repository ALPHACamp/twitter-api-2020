'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {});
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet)
    Reply.belongsTo(models.User)
  };
  return Reply;
};