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
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      account: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          len: [0, 50]
        }
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://raw.githubusercontent.com/LJBL22/react_twitter/3d808b59166970aa7c34cbb78dba58d70b11fc63/src/logo.svg'
      },
      cover_url: {
        type: Sequelize.STRING,
        defaultValue: 'https://github.com/LJBL22/react_twitter/blob/main/src/assets/images/defaultCover.jpg?raw=true'
      },
      introduction: {
        type: Sequelize.TEXT,
        validate: {
          len: [0, 160]
        }
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user'
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users')
  }
}
