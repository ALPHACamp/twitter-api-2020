'use strict';
module.exports = (sequelize, DataTypes) => {
  const TimelineRecord = sequelize.define('TimelineRecord', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ReplyId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LikeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FollowerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SubscribeTweetId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isRead: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
  TimelineRecord.associate = function (models) {
    TimelineRecord.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'Receiver'
    }),
      TimelineRecord.belongsTo(models.Reply, {
        foreignKey: 'ReplyId',
        as: 'Reply'
      }),
      TimelineRecord.belongsTo(models.Like, {
        foreignKey: 'LikeId',
        as: 'Like'
      }),
      TimelineRecord.belongsTo(models.User, {
        foreignKey: 'FollowerId',
        as: 'Follower'
      }),
      TimelineRecord.belongsTo(models.Tweet, {
        foreignKey: 'SubscribeTweetId',
        as: 'SubscribeTweet'
      })
  };
  return TimelineRecord;
};