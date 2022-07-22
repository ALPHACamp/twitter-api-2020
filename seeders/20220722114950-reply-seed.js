'use strict'
const faker = require('faker')

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

    users.shift()

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: tweets.length * 3 }).map((_, index) =>
        ({
          UserId: users[Math.floor(Math.random() * (users.length - 1))].id,
          TweetId: tweets[Math.floor((index / 3))].id,
          comment: faker.lorem.text().substring(0, 30),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
