'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let userId = ''
    for (let i = 2; i < 7; i++) {
      userId += String(i).repeat(10)
    }
    const userIdArray = userId.split('') //每個使用者10篇文

    return queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) =>
      ({
        description: faker.lorem.sentences(),
        UserId: userIdArray[i],
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};