'use strict';
const faker = require('faker')
let likesArray = []
for (let I = 0; I < 5; I++) {
  for (let i = 0; i < 5; i ++) {
    likesArray.push({
      TweetId: I * 30 + i * 10 + 1, // I=0 [1,11,21,31,41]; I=1 [31,41,51,61,71] I=2 [61,71,81,91,101]
      UserId: I * 10 + 11,  // [11,21,31,41,51]
      createdAt: faker.date.recent(10),
      updatedAt: new Date()
    })
  }
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    // 每個user like 5篇
    return queryInterface.bulkInsert('Likes', likesArray)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {})
  }
};
