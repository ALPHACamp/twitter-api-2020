'use strict'
const faker = require('faker')
const { SEED_USERS_AMOUNT, TWEETS_PER_USER } = require('../helpers/seeder-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE `role` = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Tweets', Array.from({
      length: TWEETS_PER_USER * SEED_USERS_AMOUNT
    }, (_, i) => ({
      UserId: users[Math.floor(i / TWEETS_PER_USER)].id,
      description: faker.lorem.sentences(2),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    )
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', { })
  }
}
