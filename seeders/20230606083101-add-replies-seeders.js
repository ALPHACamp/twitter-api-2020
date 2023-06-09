'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replies = []
    tweets.forEach(tweet => {
      replies.push(
        ...Array.from({ length: 5 }, (_, i) => ({
          UserId: users[Math.floor(Math.random() * users.length)].id,
          TweetId: tweet.id,
          comment: faker.lorem.paragraph(1),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )
    })

    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
