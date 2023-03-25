'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const commentsPerTweet = 3
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const totalTweets = tweets.length * commentsPerTweet

    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: totalTweets }, (_, index) => ({
        User_id: users[Math.floor(Math.random() * users.length)].id,
        Tweet_id: tweets[Math.floor(index / commentsPerTweet)].id, // 使每篇Tweet有三個留言
        comment: faker.lorem.sentence().substring(0, 140),
        created_at: faker.date.between('2023-02-21T00:00:00.000Z', '2023-02-22T00:00:00.000Z'),
        updated_at: faker.date.between('2023-02-23T00:00:00.000Z', '2023-02-24T00:00:00.000Z')
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
