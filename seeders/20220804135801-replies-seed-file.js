'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const repliesArr = []

    // every user has one reply at least
    users.forEach(user => {
      const getIndex = Math.floor(Math.random() * tweets.length)
      const tweet = tweets[getIndex]
      repliesArr.push({
        UserId: user.id,
        TweetId: tweet.id,
        comment: faker.lorem.text().substring(0, 100),
        createdAt: faker.date.recent(),
        updatedAt: new Date()
      })
    })

    // every tweet has three replies at least
    tweets.forEach(tweet => {
      for (let i = 0; i < 3; i++) {
        const getIndex = Math.floor(Math.random() * users.length)
        const user = users[getIndex]
        repliesArr.push({
          UserId: user.id,
          TweetId: tweet.id,
          comment: faker.lorem.text().substring(0, 100),
          createdAt: faker.date.recent(),
          updatedAt: new Date()
        })
      }
    })

    await queryInterface.bulkInsert('Replies', repliesArr, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
