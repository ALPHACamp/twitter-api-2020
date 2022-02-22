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
      type: DataTypes.INTEGER,
      reference: {
        model: 'Users',
        key: 'id'
      }
    },
    TweetId: {
      type: DataTypes.INTEGER,
      reference: {
        model: 'Tweets',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  Like.associate = function (models) {
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
  };
  return Like;
};