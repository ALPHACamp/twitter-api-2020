'use strict';
const faker = require('faker')
let tweetIdArray = []  // [{TweetId: 1} * 3 , {TweetId: 2} * 3, ..., {TweetId: 50} * 3 ]
for (let i = 1; i <= 50 ; i++) {
  let oneTweetIdArray = Array(3).fill({ TweetId: i }) //[{TweetId: 1} *3 ]
  tweetIdArray.push(...oneTweetIdArray)
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Replies', tweetIdArray.map((d, i) => ({
      TweetId: d.TweetId,
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
