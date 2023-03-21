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
      password: {
        type: Sequelize.STRING
      },
      account: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING(50)
      },
      avatar: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.STRING(160)
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user'
      },
      background: {
        type: Sequelize.STRING,
        defaultValue: 'https://images.unsplash.com/photo-1580436541340-36b8d0c60bae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80'
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
