'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let tweetId = ''
    for (let i = 1; i < 100; i = i + 2) {
      tweetId += String((i * 5) + ',').repeat(3)
    }
    const tweetIdArray = tweetId.split(',') //每個推文3個留言
    tweetIdArray.splice(-1, 1)
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        content: faker.lorem.words(),
        UserId: Math.floor(Math.random() * 6) * 10 + 5,
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

//5 15 25 35 45 55
//1  3  5  7  9  11