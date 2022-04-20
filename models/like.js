'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'
  });
  Like.associate = function(models) {
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  };
  return Like;
};