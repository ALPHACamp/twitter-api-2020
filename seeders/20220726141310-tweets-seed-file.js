'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE `role` = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    const SEED_TWEETS = []
    await users.forEach(user => {
      for (let i = 0; i < 10; i++) {
        SEED_TWEETS.push({
          description: faker.lorem.sentence(),
          user_id: user.id,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Tweets', [...SEED_TWEETS], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
};
