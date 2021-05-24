'use strict'

const faker = require('faker')

module.exports = {

  up: async (queryInterface, Sequelize) => {
    function fakeTweet () {
      const tweets = []
      let tweetId = 0

      for (let i = 1; i <= 5; i++) { // 5 users withoot admin, 10 tweets per user
        for (let j = 1; j <= 10; j++) {
          tweets.push({
            id: tweetId += 1,
            UserId: i + 1,
            description: faker.lorem.text().slice(0, 140),
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
      return tweets
    }

    await queryInterface.bulkInsert('Tweets',
      fakeTweet(), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
