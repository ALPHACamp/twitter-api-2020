'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = await queryInterface.sequelize.query(
      "SELECT id FROM Tweets",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const replyList = []
    
    tweets.forEach(tweet => {
      replyList.push(...Array.from({ length: 3 }, () => ({
        user_id: users[Math.floor(Math.random() * users.length)].id,
        tweet_id: tweet.id,
        comment: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date()
      })))
    })

    await queryInterface.bulkInsert('Replies', replyList, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
