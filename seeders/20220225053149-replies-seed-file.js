'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id, name FROM users where role = 'user';", {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )

    const tweets = await queryInterface.sequelize.query(
      'SELECT * FROM tweets;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const insertedReplies = tweets.map(tweet => {
      return Array.from({ length: 3 }, () => ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        comment: faker.lorem.text().substring(1, 40),
        TweetId: tweet.id,
        createdAt: new Date(+(tweet.createdAt) + Math.floor(Math.random() * 100000000)), // minus 10^10 milisecond from current date
        updatedAt: new Date(+(tweet.createdAt) + Math.floor(Math.random() * 100000000))
      }))
    }).flat()

    await queryInterface.bulkInsert('Replies', insertedReplies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
