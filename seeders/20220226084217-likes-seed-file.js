'use strict'
const { RandomChooser } = require('../helpers/seed-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id, name FROM Users where role = 'user';", {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT * FROM Tweets;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const userIds = users.map(user => user.id)
    const userRandomChooser = new RandomChooser(userIds)

    const insertedLikes = tweets.map(tweet => {
      userRandomChooser.refresh()
      const likeTimes = Math.floor(Math.random() * userIds.length) + 1
      return Array.from({ length: likeTimes }, () => {
        const newDate = new Date(+(tweet.createdAt) + Math.floor(Math.random() * 1000000000)) // add 10^9 milisecond from tweet createdAt date
        return {
          TweetId: tweet.id,
          UserId: userRandomChooser.choose(),
          createdAt: newDate,
          updatedAt: newDate
        }
      })
    }).flat()

    await queryInterface.bulkInsert('Likes', insertedLikes, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
