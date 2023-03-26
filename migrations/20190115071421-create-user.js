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
        defaultValue: 'https://raw.githubusercontent.com/mirageapache/simple_twitter_frontend/d387af0317fc172f36eacd3a084e4c8eddedabf8/src/assets/images/default_user_avatar.jpg'
      },
      cover: {
        type: Sequelize.STRING,
        defaultValue: 'https://i.imgur.com/eUhttps://raw.githubusercontent.com/mirageapache/simple_twitter_frontend/main/src/assets/images/default_user_cover.jpgeMQvx.png'
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
