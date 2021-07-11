'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let userId = ''
    for (let i = 3; i <= 11; i = i + 2) {
      userId += (String(i * 5) + ',').repeat(10)
    }
    const userIdArray = userId.split(',') //每個使用者10篇文
    userIdArray.splice(-1, 1)

    let id = ''
    for (let i = 1; i < 100; i = i + 2) {
      id += String((i * 5) + ',')
    }
    const idArray = id.split(',') //每個使用者10篇文
    idArray.splice(-1, 1)
    return queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) =>
      ({
        id: idArray[i],
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