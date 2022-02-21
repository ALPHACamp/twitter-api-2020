'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
  }, {
    tableName: 'Replies',
    underscored: true
  });
  Reply.associate = function(models) {
    Reply.belongsTo(models.User, { foreignKey: 'user_id' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'tweet_id' })
  };
  return Reply;
};