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
      email: {
        type: Sequelize.STRING
      },
      account: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user'
      },
      introduction: {
        type: Sequelize.TEXT
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://i.imgur.com/PiJ0HXw.png'
      },
      cover: {
        type: Sequelize.STRING,
        defaultValue: 'https://i.imgur.com/xZoHPfC.png'
      },
      password: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
