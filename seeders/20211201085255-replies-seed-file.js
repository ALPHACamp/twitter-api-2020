'use strict';
const faker = require('faker')
let tweetIdArray = []  // [1,1,1,2,2,2,3,3,3...,50,50,50]
for (let i = 1; i <= 50; i++) {
  let oneTweetId = Array(3).fill(i)
  tweetIdArray.push(...oneTweetId)
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Replies', tweetIdArray.map((d, i) => ({
      TweetId: d,
      UserId: (i % 5) + 1,  // i = 1~50; i % 5 = 0~4
      comment: faker.lorem.text().slice(0,280),
      createdAt: new Date(),
      updatedAt: new Date()
    })))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
