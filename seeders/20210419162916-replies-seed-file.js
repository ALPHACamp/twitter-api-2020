'use strict'

const faker = require('faker')

module.exports = {

  up: async (queryInterface, Sequelize) => {
    function fakeReplies() {
      const replies = []
      let replyId = 1
      let count = 0

      for (let j = 1; j <= 60; j++) { // total 60 tweets
        for (let i = 1; i <= 3; i++) { // 3 replies per tweet
          replies.push({
            id: count === 0 ? 1 : replyId += 1,
            UserId: Math.floor((Math.random() * 6) + 1),
            TweetId: j,
            comment: faker.lorem.text(),
            createdAt: new Date(),
            updatedAt: new Date()
          })
          count++
        }
      }
      return replies
    }

    await queryInterface.bulkInsert('Replies',
      fakeReplies(), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}

