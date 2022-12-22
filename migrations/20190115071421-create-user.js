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
      avatar: {
        defaultValue: 'https://i.imgur.com/ifxbHUn.jpeg',
        type: Sequelize.STRING
      },
      cover: {
        defaultValue: 'https://i.imgur.com/dIsjVjn.jpeg',
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT
      },
      role: {
        allowNull: false,
        defaultValue: 'user',
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
