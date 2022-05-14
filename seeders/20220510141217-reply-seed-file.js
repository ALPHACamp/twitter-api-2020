'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const data = []
    const eachTweetReply = 3
    for (let i = 0; i < tweets.length; i++) {
      for (let j = 0; j < eachTweetReply; j++) {
        data.push({
          comment: "faker.lorem.text()",
          tweet_id: tweets[i].id,
          user_id: users[Math.floor(Math.random() * (users.length - 1)) + 1].id,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Replies', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
