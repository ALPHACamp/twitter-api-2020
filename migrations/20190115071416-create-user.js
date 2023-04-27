'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        validate: {
          notNull: true
        }
      },
      account: {
        type: Sequelize.STRING,
        validate: {
          notNull: true
        }
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          notNull: true
        }
      },
      password: {
        type: Sequelize.STRING,
        validate: {
          notNull: true
        }
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          notNull: true
        }
      },
      avatar: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT
      },
      cover: {
        type: Sequelize.STRING
      },
      role: {
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