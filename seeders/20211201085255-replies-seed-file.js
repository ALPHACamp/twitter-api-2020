'use strict';
const faker = require('faker')
let tweetIdArray = []  // [1,1,1,11,11,11....,491,491,491]
for (let i = 0; i < 50; i++) {
  let oneTweetId = Array(3).fill(1 + i * 10)
  tweetIdArray.push(...oneTweetId)
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Replies', tweetIdArray.map((d, i) => ({
      TweetId: d,
      UserId: (i % 5) * 10 + 11,  // [11,21,31,41,51] ; i = 1~50; i % 5 = 0~4
      comment: faker.lorem.text().slice(0, 280),
      createdAt: faker.date.recent(10),
      updatedAt: new Date()
    })))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
