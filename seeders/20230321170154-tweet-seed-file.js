'use strict'
const { User } = require('../models')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userData = await User.findAndCountAll()
    const tweetSeedData = Array.from({ length: 5 * userData.count }).map((item, i) => {
      const user_id = userData.rows[Math.floor(i / 5)].dataValues.id
      return {
        user_id,
        description: faker.lorem.paragraph(),
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    await queryInterface.bulkInsert('Tweets', tweetSeedData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}