'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      //each user has 10 tweets. Description length is between 5 to 15 words, and within 140 characters
      const tweets = []
      for (let UserId = 1; UserId <= 5; UserId++) {
        for (let i = 1; i <= 10; i++) {
          tweets.push({
            id: (UserId - 1) * 10 + i,
            UserId,
            description: faker.lorem.sentence(Math.floor(Math.random() * 11) + 5).slice(0, 140),
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
      await queryInterface.bulkInsert('Tweets', tweets)
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Tweets', {})
    } catch (error) {
      console.log(error)
    }
  }
};
