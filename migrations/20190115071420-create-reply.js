'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Replies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
        // allowNull: false
        // references: {
        //   model: 'Users',
        //   key: 'id'
        // }
      },
      TweetId: {
        type: Sequelize.INTEGER
        // allowNull: false,
        // references: {
        //   model: 'Tweets',
        //   key: 'id'
        // }
      },
      comment: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('Replies')
  }
}
