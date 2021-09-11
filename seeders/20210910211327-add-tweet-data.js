'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tweets',
      Array.from({ length: 60 }).map((item, index) =>
        ({
          UserId: (index % 6) === 0 ? 6: (index % 6) + 1,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      )
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tweets', null, {})
  }
};
