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
      name: {
        type: Sequelize.STRING
      },
      account: {
        type: Sequelize.STRING(191),
        unique: true
      },
      email: {
        type: Sequelize.STRING(191),
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      avatar: {
        type: Sequelize.STRING
      },
      cover_photo: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      role: {
        // allowNull: false,
        type: Sequelize.STRING
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
