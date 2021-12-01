'use strict';
const faker = require('faker')
let userIdArray = []  // [1,1,1,..., 2,2,2,...]
for (let i = 1; i <= 5; i++) {
  let oneUserIdArray = Array(10).fill(i)  //[1,1,1,1,1,1,1,1,1,1] 10個1
  userIdArray.push(...oneUserIdArray)
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tweets', 
    userIdArray.map((d, i) => ({
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
