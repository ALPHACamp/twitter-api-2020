'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(189),
        unique: true
      },
      password: {
        type: Sequelize.STRING(189)
      },
      name: {
        type: Sequelize.STRING(189)
      },
      avatar: {
        type: Sequelize.STRING(189)
      },
      account: {
        type: Sequelize.STRING(189),
        unique: true
      },
      cover: {
        type: Sequelize.STRING(189)
      },
      introduction: {
        type: Sequelize.TEXT
      },
      role: {
        type: Sequelize.STRING(189)
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
    await queryInterface.dropTable('Users');
  }
};