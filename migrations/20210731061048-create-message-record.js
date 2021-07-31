'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MessageRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SenderId: {
        type: Sequelize.INTEGER
      },
      ReceiverId: {
        type: Sequelize.INTEGER
      },
      RoomId: {
        type: Sequelize.INTEGER
      },
      unreadNum: {
        type: Sequelize.INTEGER
      },
      isSeen: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('MessageRecords');
  }
};