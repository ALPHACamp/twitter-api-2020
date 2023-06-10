'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(50)
      },
      email: {
        type: Sequelize.STRING(254),
        unique: true
      },
      account: {
        type: Sequelize.STRING(254),
        unique: true
      },
      password: {
        type: Sequelize.STRING(254)
      },
      avatar: {
        type: Sequelize.STRING(254),
        defaultValue: 'https://i.imgur.com/BMxWxE8.jpeg'
      },
      backgroundImage: {
        type: Sequelize.STRING(254),
        defaultValue: 'https://i.imgur.com/5ZDLPuU.jpeg'
      },
      introduction: {
        type: Sequelize.TEXT
      },
      role: {
        type: Sequelize.STRING(254)
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users')
  }
}
