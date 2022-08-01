'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = []
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE account <> "root";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    users.map(user => {
      tweets.push(...Array.from({ length: 10 }, () => ({
        description: faker.lorem.paragraph().substring(0, 140),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: user.id
      })))
    })
    await queryInterface.bulkInsert('Tweets', tweets, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
