'use strict'
const faker = require('faker')
const REPLIES_PER_TWEETS = 3

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersIdArr = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT `id`, `UserId` FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replies = []
    tweets.forEach(tweet => {
      const usersIdCheckRepeatArr = []
      let UserId
      replies.push(
        ...Array.from({ length: REPLIES_PER_TWEETS }).map(() => {
          do {
            UserId = usersIdArr[Math.floor(Math.random() * usersIdArr.length)].id
          } while (UserId === tweet.UserId || usersIdCheckRepeatArr.includes(UserId))
          usersIdCheckRepeatArr.push(UserId)
          return ({
            UserId,
            TweetId: tweet.id,
            comment: faker.lorem.sentence(7),
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
        ))
    })

    await queryInterface.bulkInsert('Replies', replies, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
