'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE `role` = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replyList = []
    const eachTweetReply = 3

    for (let i = 0; i < tweets.length; i++) {
      for (let k = 0; k < eachTweetReply; k++) {
        replyList.push({
          user_Id: users[Math.floor(Math.random() * users.length)].id,                   
          tweet_id: tweets[i].id,
          comment: faker.lorem.text().slice(0, 130),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Replies', replyList, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}