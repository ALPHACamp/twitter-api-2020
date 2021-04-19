'use strict'

const faker = require('faker')

module.exports = {

  up: async (queryInterface, Sequelize) => {

    function fakeTweet() {
      const tweets = []
      let tweetId = 1
      let count = 0

      for (let i = 1; i <= 6; i++) { // users 6
        for (let j = 1; j <= 10; j++) { // 10 tweets per user
          tweets.push({
            id: count === 0 ? 1 : tweetId += 1,
            UserId: i,
            description: faker.lorem.text(),
            createdAt: new Date(),
            updatedAt: new Date()
          })
          count++
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


