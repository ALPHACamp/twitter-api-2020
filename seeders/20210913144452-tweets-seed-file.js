'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add altering commands here.
    const data = []

    for (let i = 0; i < 5; i++) {
      data.push(
        ...Array.from({ length: 10 }).map((_, j) => ({
          id: j * 10 + 1 + i * 100,
          UserId: i * 10 + 11,
          description: faker.lorem.sentence().substring(0, 140),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )
    }

    return queryInterface.bulkInsert('Tweets', data)
  },

  down: (queryInterface, Sequelize) => {
    // Add reverting commands here.
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
