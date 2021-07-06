'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    UserId: {
      type: DataTypes.INTEGER
    },
    TweetId: {
      type: DataTypes.INTEGER
    },
    content: {
      type: DataTypes.STRING(140)
    },
  }, {});
  Reply.associate = function (models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  };
  return Reply;
};