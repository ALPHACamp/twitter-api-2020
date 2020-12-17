'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      //each tweet has 3 replies from random users
      const replies = []
      for (let TweetId = 1; TweetId <= 5 * 10; TweetId++) {
        for (let i = 1; i <= 3; i++) {
          replies.push({
            id: (TweetId - 1) * 3 + i,
            TweetId,
            UserId: Math.ceil(Math.random() * 5) + 1,
            comment: faker.lorem.text(),
            createdAt: new Date(2020, Math.ceil(Math.random() * 3) + 4, Math.ceil(Math.random() * 20)),
            updatedAt: new Date(2020, Math.ceil(Math.random() * 3) + 4, Math.ceil(Math.random() * 20))
          })
        }
      }
      await queryInterface.bulkInsert('Replies', replies)
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Replies', {})
    } catch (error) {
      console.log(error)
    }
  }
}
