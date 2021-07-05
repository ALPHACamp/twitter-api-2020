'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Tweets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      likeNum: {
        type: Sequelize.INTEGER,
      },
      replyNum: {
        type: Sequelize.INTEGER,
      },
      AdminId: {
        type: Sequelize.INTEGER,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tweets');
  }
};