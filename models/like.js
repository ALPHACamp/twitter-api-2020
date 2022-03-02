'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    TweetId: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    modelName: 'Like',
    tableName: 'Likes'
  });
  Like.associate = function (models) {
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId', as: 'LikedTweet' })
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
  };
  return Like;
};