'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let tweetId = ''
    for (let i = 5; i <= 250; i = i + 5) {
      tweetId += (String(i) + ',').repeat(3)
    }
    const tweetIdArray = tweetId.split(',') //每個推文3個留言
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        content: faker.lorem.words(),
        UserId: (Math.floor(Math.random() * 5) + 2) * 5,
        TweetId: tweetIdArray[i],
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
