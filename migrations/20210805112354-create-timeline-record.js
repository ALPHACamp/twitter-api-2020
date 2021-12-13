'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TimelineRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ReplyId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      LikeId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      FollowerId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      SubscribeTweetId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      isRead: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TimelineRecords');
  }
};