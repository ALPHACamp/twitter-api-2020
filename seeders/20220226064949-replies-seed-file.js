'use strict'
const { useFakeServer } = require("sinon")
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const repliesNum = 3
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: tweets.length }, (_, i) => ({
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        TweetId: tweets[Math.floor(i / repliesNum)].id,
        UserId: users[Math.floor(Math.random() * users.length)].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}