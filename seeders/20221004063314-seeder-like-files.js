'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const LIKE_TWEETS_PER_USER = 10
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const likes = []
    users.forEach(user => {
      likes.push(
        ...Array.from({ length: LIKE_TWEETS_PER_USER }, () => ({
          UserId: user.id,
          TweetId: tweets[Math.floor(Math.random() * tweets.length)].id,
          createdAt: faker.date.between('2022-09-01T00:00:00.000Z', '2022-10-01T00:00:00.000Z'),
          updatedAt: new Date()
        })))
    })
    await queryInterface.bulkInsert('Likes', likes, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
