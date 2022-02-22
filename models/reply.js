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
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    TweetId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tweets',
        key: 'id'
      }
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
    tableName: 'Relies'
  });
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweets, { foreignKey: 'TweetId' })
    Reply.belongsTo(models.Users, { foreignKey: 'UserId' })
  };
  return Reply;
};