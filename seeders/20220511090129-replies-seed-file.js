'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = '';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const replies = []

    for (let i = 0; i < tweets.length; i++) {
      for (let c = 0; c < 3; c++) {
        const data = {
          user_id: users[Math.floor(Math.random() * users.length)].id,
          tweet_id: tweets[i].id,
          comment: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        }
        replies.push(data)
      }
    }

    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {
      where: {},
      truncate: true
    })
  }
}
