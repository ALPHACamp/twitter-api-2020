'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let tweetsList = []
    for (let j = 1; j <= 5; j++) {
      for (let i = 1; i <= 10; i++) {
        const list = {
          id: 0,
          UserId: j,
          description: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        tweetsList.push(list)
      }
    }
    for (let x = 0; x <= 49; x++) {
      tweetsList[x].id = x + 1
    }

    await queryInterface.bulkInsert('Tweets', tweetsList)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
