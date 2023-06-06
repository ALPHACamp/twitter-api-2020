'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
  }, {});
  Reply.associate = function(models) {
    Reply.belongsTo(models.User, { foreignKey: 'UserId'})
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId'})
  };
  Reply.init({
    UserId: DataTypes.STRING,
    TweetId: DataTypes.STRING,
    comment: DataTypes.TEXT
  },{
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies'
  })
  return Reply;
};