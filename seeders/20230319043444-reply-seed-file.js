'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const replies = tweets.flatMap(tweet => {
      const userIds = users.map(user => user.id).slice(1).sort(() => Math.random() - 0.5).slice(0, 3)
      return userIds.map(userId => ({
        comment: faker.lorem.lines(1),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: userId,
        tweet_id: tweet.id
      }))
    })

    await queryInterface.bulkInsert('Replies', replies
    )
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Replies', {})
  }
}
