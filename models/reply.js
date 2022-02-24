'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    TweetId: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.TEXT
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
    modelName: 'Reply',
    tableName: 'Replies'
  });
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    Reply.belongsTo(models.User, { foreignKey: 'UserId' })
  };
  return Reply;
};