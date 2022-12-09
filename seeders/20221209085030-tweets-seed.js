'use strict'
const faker = require('faker')
const { SEED_USERS_AMOUNT } = require('../helpers/seeder-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const TWEETS_PER_USER = 10
    const users = await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users`; ',
      // 目前會按所有user分，後面我想改成按seed user分
      // WHERE find_in_set(`@example.com`, email);',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Tweets', Array.from({
      length: TWEETS_PER_USER * SEED_USERS_AMOUNT
    }, (_, i) => ({
      UserId: users[Math.floor(i / TWEETS_PER_USER)].id,
      description: faker.lorem.sentences(6),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    )
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', { })
    // 目前會刪除所有tweets，後面我想改成只刪除seed tweets
  }
}
