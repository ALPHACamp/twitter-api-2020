'use strict'
const faker = require('faker')

const DEFAULT_COUNT = 3

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Replies', 
    Array.from({ length: tweets.length * DEFAULT_COUNT }).map((_, i) =>
          ({
            UserId: users[Math.floor(Math.random() * users.length)].id,
            TweetId: tweets[Math.floor(i/DEFAULT_COUNT)].id,
            comment: faker.lorem.text().substring(0, 20),
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
