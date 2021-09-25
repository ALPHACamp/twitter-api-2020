'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      triggerId: {
        type: Sequelize.INTEGER
      },
      targetId: {
        type: Sequelize.INTEGER
      },
      TweetId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      FollowshipId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      LikeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ReplyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      SubscribeshipId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Notifications');
  }
};