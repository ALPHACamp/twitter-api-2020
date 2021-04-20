'use strict'

const faker = require('faker')

module.exports = {

  up: async (queryInterface, Sequelize) => {
    function fakeReplies () {
      const replies = []
      let replyId = 0

      for (let j = 1; j <= 60; j++) { // total 60 tweets, 3 replies per tweet
        for (let i = 1; i <= 3; i++) {
          replies.push({
            id: replyId += 1,
            UserId: Math.floor((Math.random() * 6) + 1),
            TweetId: j,
            comment: faker.lorem.text(),
            createdAt: new Date(),
            updatedAt: new Date()
          })
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
