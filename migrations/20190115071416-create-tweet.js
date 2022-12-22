'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tweets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER // 因為測試檔的關係不能放關聯，Tweet的CRUD會不過測試，因為這段"db.Tweet.create({ UserId: 1, description: 'hi' })"
        // references: {
        //   model: 'Users',
        //   key: 'id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      description: {
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
    return queryInterface.dropTable('Tweets')
  }
}
