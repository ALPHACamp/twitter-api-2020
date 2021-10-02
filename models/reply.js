'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {});
  Reply.associate = function (models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  };
  return Reply;
};