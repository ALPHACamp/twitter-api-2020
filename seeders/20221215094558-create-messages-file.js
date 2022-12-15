'use strict'

const faker = require('faker')
// user_id, tweet_id,comment, created_at, updated_at
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
  },

  down: async (queryInterface, Sequelize) => {}
}
