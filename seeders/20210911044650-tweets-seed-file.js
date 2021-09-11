'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map(
        (tweet, index) => ({
          id: index * 10 + 5,
          description: faker.lorem.sentence(),
          userId: Math.ceil((index + 1) / 10) * 10 + 5,
          createdAt: new Date(),
          updatedAt: new Date()
        }),
        {}
      )
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Tweets', null, { truncate: true })
  }
}
