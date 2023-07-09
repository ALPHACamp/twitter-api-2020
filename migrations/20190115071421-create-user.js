'use strict'
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
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT
      },
      telephone: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      cover_photo: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      status:{
        type: Sequelize.STRING,
        defaultValue: 'Pending'
      },
      confirm_token: {
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
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
