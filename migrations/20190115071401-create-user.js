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
        unique: true,
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING(50)
      },
      avatar: {
        defaultValue: 'https://i.imgur.com/HD4yT2V.jpg',
        type: Sequelize.STRING
      },
      cover: {
        defaultValue: 'https://i.imgur.com/bW0IDLD.png',
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.STRING(160)

      },
      role: {
        defaultValue: 'user',
        allowNull: false,
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
