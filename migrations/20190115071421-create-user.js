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
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        validate: { isEmail: true }
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING,
        validate: { len: [1, 50] },
      },
      avatar: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT,
        validate: { len: [0, 160] },
      },
      role: {
        type: Sequelize.STRING
      },
      background_image: {
        type: Sequelize.STRING,
        defaultValue: 'https://img.onl/nFml6y'
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
