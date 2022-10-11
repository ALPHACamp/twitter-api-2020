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
        validate: {
          isEmail: {
            msg: "The email doesn't fit the email format"
          }
        }
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          len: {
            args: [1, 50],
            msg: "Name is accepted within 50 characters"
          }
        }
      },
      avatar: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT,
        validate: {
          len: {
            args: [1, 160],
            msg: "introduction is accepted within 160 characters"
          }
        }
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
