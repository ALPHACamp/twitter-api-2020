'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE
    },
    {
      tableName: 'Likes',
      paranoid: true
    }
  )
  Like.associate = function (models) {
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
  };
  return Like;
};