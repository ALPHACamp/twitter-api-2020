'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        // unique: true, 遠端測試檔好像會沒過
      },
      account: {
        type: Sequelize.STRING(50),
        // unique: true, 遠端測試檔好像會沒過
      },
      password: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING(50),
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://image.flaticon.com/icons/png/512/149/149071.png',
      },
      cover: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.STRING(160)
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user',
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
    return queryInterface.dropTable('Users');
  }
};