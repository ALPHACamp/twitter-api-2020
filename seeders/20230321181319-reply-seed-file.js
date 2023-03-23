'use strict'
const faker = require('faker')
const { shuffledArray } = require('../helpers/math-helpers.js')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role = 'user';", { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Replies', Array.from({ length: 600 }, (_, index) => ({
      comment: faker.lorem.text(20),
      created_at: new Date(),
      updated_at: new Date(),
      Tweet_id: shuffledArray(tweets)[index % 100].id,
      User_id: shuffledArray(users)[index % 20].id
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
