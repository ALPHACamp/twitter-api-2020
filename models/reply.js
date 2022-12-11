'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    UserId: {
      type: Sequelize.INTEGER
    },
    TweetId: {
      type: Sequelize.INTEGER
    },
    comment: {
      type: Sequelize.TEXT
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: true
  });
  Reply.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    Tweet.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
  };
  return Reply;
};