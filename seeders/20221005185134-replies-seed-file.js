'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const replies = []
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE account <> "root"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // eslint-disable-next-line array-callback-return
    tweets.map(tweet => {
      replies.push(...Array.from({ length: 3 }, () => ({
        comment: faker.lorem.text().substring(0, 50),
        User_id: users[Math.floor(Math.random() * users.length)].id,
        Tweet_id: tweet.id,
        created_at: new Date(),
        updated_at: new Date()
      })))
    })

    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
