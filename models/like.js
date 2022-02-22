'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER,
    isLike: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true  
  });
  Like.associate = function(models) {
    Reply.belongsTo(model.User, { foreignkey: 'userId' })
    Reply.belongsTo(model.Tweet, { foreignkey: 'tweetId' })
  };
  return Like;
};