'use strict';
const faker = require('faker')
let userIdArray = []  // [{UserId: 1}, {UserId: 1}, ..., {UserId: 2}...]
for (let i = 1; i <= 5; i ++) {
  let oneUserIdArray = Array(10).fill({ UserId: i })  //[{UserId: 1} * 10]
  userIdArray.push(...oneUserIdArray)
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tweets', 
    userIdArray.map((d, i) => ({
      UserId: d.UserId,
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
