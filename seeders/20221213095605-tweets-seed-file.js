'use strict'
const faker = require('faker')
const TWEETS_PER_USER = 10

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersIdArr = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = []
    usersIdArr.forEach(userIdObj => {
      tweets.push(
        ...Array.from({ length: TWEETS_PER_USER }, () => ({
          UserId: userIdObj.id,
          description: faker.lorem.sentence(7),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )
    })
    await queryInterface.bulkInsert('Tweets', tweets, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
