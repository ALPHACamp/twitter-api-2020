'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notifies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      tweetId: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      followingId: {
        defaultValue: 0,
        type: Sequelize.STRING
      },
      likerId: {
        defaultValue: 0,
        type: Sequelize.STRING
      },
      replierId: {
        defaultValue: 0,
        type: Sequelize.STRING
      },
      readStatus: {
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
    return queryInterface.dropTable('Notifies');
  }
};