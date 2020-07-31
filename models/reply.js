'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    likeCount: DataTypes.INTEGER
  }, {});
  Reply.associate = function (models) {
    // associations can be defined here
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
    Reply.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'ReplyId',
      as: 'LikedUsers'
    })
  };
  return Reply;
};