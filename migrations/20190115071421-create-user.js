'use strict';
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
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT
      },
      role: {
        allowNull: false,
        defaultValue: 'user',
        type: Sequelize.STRING
      },
      total_tweets: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      total_followings: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      total_followers: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      total_liked: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};