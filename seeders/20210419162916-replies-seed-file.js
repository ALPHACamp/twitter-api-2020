'use strict'

const faker = require('faker')

module.exports = {

  up: async (queryInterface, Sequelize) => {
    function fakeReplies () {
      const replies = []
      let replyId = 0

      for (let j = 1; j <= 50; j++) { // total 50 tweets, 3 users without admin randomly replies per tweet
        for (let i = 1; i <= 3; i++) {
          replies.push({
            id: replyId += 1,
            UserId: Math.floor((Math.random() * 5) + 1) + 1,
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
