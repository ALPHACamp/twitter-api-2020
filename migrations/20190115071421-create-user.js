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
      account: {
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        validate: { isEmail: true }
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING,
        validate: { len: 50 },
      },
      avatar: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT,
        validate: { len: 160  },
      },
      role: {
        type: Sequelize.STRING
      },
      cover:{
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};