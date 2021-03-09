'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const replies = []
    let replyId = 1

    for (let x = 1; x <= 50; x++) {
      for (let y = 1; y <= 5; y++) {
        replies.push(
          {
            id: replyId++,
            UserId: (10 * y) + 1,
            TweetId: x,
            comment: faker.lorem.words(140),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        )
      }
    }

    // for (let i = 6; i <= 50; i++) {
    //   replies.push(
    //     {
    //       id: replyId++,
    //       UseId: (Math.floor(Math.random() * Math.floor(5)) + 1) * 10 + 1,
    //       TweetId: x,
    //       comment: faker.lorem.words(139),
    //       createdAt: new Date(),
    //       updatedAt: new Date()
    //     }
    //   )
    // }

    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
