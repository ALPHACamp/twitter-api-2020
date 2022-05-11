'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replies = []

    for (let i = 0; i < tweets.length; i++) {
      for (let j = 0; j < 3; j++) {
        const reply = {
          reply_text: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date(),
          user_id: users[Math.floor(Math.random() * users.length)].id,
          tweet_id: tweets[i].id
        }
        replies.push(reply)
      }
    }

    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
