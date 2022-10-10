'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id, role FROM Users WHERE role = 'user'",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })

    const tweets = await queryInterface.sequelize.query("SELECT id FROM Tweets",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: tweets.length * 3 }).map((_, i) => ({
        tweet_id: tweets[Math.floor(i / 3)].id,
        user_id: users[Math.floor(Math.random() * users.length)].id,
        comment: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date()
      })
      )
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
