'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    TweetId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    comment: DataTypes.STRING(140)
  }, {});
  Reply.associate = function(models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  };
  return Reply;
};