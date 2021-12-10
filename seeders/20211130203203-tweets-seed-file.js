'use strict';
const faker = require('faker')
let userIdArray = []  // [11,11,11..., 21,21,21,...41,41,41]
for (let i = 0; i < 5; i++) {
  let oneUserIdArray = Array(10).fill(10*i+ 11 )  //[11,11,11,11,11,11...] 10個5
  userIdArray.push(...oneUserIdArray)
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tweets', 
    userIdArray.map((d, i) => ({
      id: i*10 +1,
      UserId: d,
      description: faker.lorem.sentence().slice(0, 140),
      createdAt: faker.date.recent(30),
      updatedAt: new Date()
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
