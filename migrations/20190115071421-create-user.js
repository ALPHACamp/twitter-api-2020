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
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING(50)
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://i.imgur.com/MlICwQb.jpg'
      },
      cover: {
        type: Sequelize.STRING,
        defaultValue: 'https://i.imgur.com/eUeMQvx.png'
      },
      introduction: {
        type: Sequelize.STRING(160)
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
