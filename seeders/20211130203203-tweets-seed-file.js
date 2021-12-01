'use strict';
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }).map((d, i) => ({
      description: faker.lorem.sentence().slice(0, 140),
      UserId: Math.ceil(Math.random() * 5), //1,2,3,4,5
      createdAt: new Date(),
      updatedAt: new Date()
    })))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
