'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
  }, {});
  Reply.associate = function(models) {
    Reply.belongsTo(models.User, { foreignKey: 'userId' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
  };
  // Reply.init({
  //   comment: DataTypes.TEXT
  // }, {
  //   sequelize,
  //   modelName: 'Reply',
  //   tableName: 'Replies',
  //   underscored: true
  // })
  return Reply;
};