'use strict'
const faker = require('faker')
const tweetCount = 10
const db = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: tweetCount }).map((d, i) => ({
        description: faker.lorem.sentences(),
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    ),
      await queryInterface.bulkInsert(
        'Tweets',
        Array.from({ length: tweetCount }).map((d, i) => ({
          description: faker.lorem.sentences(),
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        {}
      ),
      await queryInterface.bulkInsert(
        'Tweets',
        Array.from({ length: tweetCount }).map((d, i) => ({
          description: faker.lorem.sentences(),
          UserId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        {}
      ),
      await queryInterface.bulkInsert(
        'Tweets',
        Array.from({ length: tweetCount }).map((d, i) => ({
          description: faker.lorem.sentences(),
          UserId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        {}
      ),
      await queryInterface.bulkInsert(
        'Tweets',
        Array.from({ length: tweetCount }).map((d, i) => ({
          description: faker.lorem.sentences(),
          UserId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        {}
      ),
      await queryInterface.bulkInsert(
        'Tweets',
        Array.from({ length: tweetCount }).map((d, i) => ({
          description: faker.lorem.sentences(),
          UserId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        {}
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  },
}
