
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {});
  Reply.associate = function (models) {
    Reply.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'user'
    })
    Reply.belongsTo(models.Tweet, {
      foreignKey: 'TweetId',
      as: 'tweet'
    })
  };
  return Reply;
};