'use strict'
const { RandomChooser } = require('../helpers/seed-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id, name FROM users where role = 'user';", {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT * FROM tweets;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const userIds = users.map(user => user.id)
    const userRandomChooser = new RandomChooser(userIds)

    const insertedLikes = tweets.map(tweet => {
      userRandomChooser.refresh()
      const likeTimes = Math.floor(Math.random() * userIds.length) + 1
      return Array.from({ length: likeTimes }, () => ({
        TweetId: tweet.id,
        UserId: userRandomChooser.choose(),
        createdAt: new Date(+(tweet.createdAt) + Math.floor(Math.random() * 100000000)), // minus 10^10 milisecond from current date
        updatedAt: new Date(+(tweet.createdAt) + Math.floor(Math.random() * 100000000))
      }))
    }).flat()

    await queryInterface.bulkInsert('Likes', insertedLikes, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
