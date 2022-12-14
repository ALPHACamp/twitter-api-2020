'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const commentsPerTweet = 3
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: (tweets.length) * commentsPerTweet }, (_, index) => ({
        User_id: users[Math.floor(Math.random() * (users.length - 1)) + 1].id,
        Tweet_id: tweets[Math.floor(index / commentsPerTweet)].id,
        comment: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
