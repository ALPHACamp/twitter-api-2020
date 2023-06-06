'use strict'
const DEFAULT_REPLAIES_FOR_EACH_TWEET = 3
const DEFAULT_WORD_LIMIT = 50

const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = '普通會員';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const totalReplies = tweets.length * DEFAULT_REPLAIES_FOR_EACH_TWEET
    await queryInterface.bulkInsert('Replys',
      Array.from({ length: totalReplies }, (_, index) => ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        TweetId: tweets[Math.floor(index / DEFAULT_REPLAIES_FOR_EACH_TWEET)].id,
        comment: faker.lorem.sentence().substring(0, DEFAULT_WORD_LIMIT),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replys', {})
  }
}
