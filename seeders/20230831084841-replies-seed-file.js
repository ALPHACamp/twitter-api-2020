'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE Users.role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replyData = []
    tweets.forEach(tweet => {
      const userData = users.slice()
      for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * userData.length)
        const user = userData.splice(index, 1)[0]
        replyData.push({
          user_id: user.id,
          tweet_id: tweet.id,
          comment: faker.lorem.text().substring(0, 60),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Replies', replyData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
