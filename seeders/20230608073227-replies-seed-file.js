'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [tweets, users] = await Promise.all([
      queryInterface.sequelize.query(
        'SELECT id FROM Tweets;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        "SELECT id FROM Users WHERE role <> 'admin'",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])

    // Each tweet has 3 replies and each user has at least 1 reply
    const eachUserTweetsCount = 3
    const repliedTweets = []

    for (let i = 0; i < (tweets.length + users.length); i++) {
      let comment = faker.lorem.text()
      if (comment.length > 140) {
        comment = comment.slice(0, 140)
      }

      if (i < users.length) {
        // Each user has at least 1 reply
        repliedTweets.push({
          UserId: users[i].id,
          TweetId: tweets[Math.floor(Math.random() * tweets.length)].id,
          comment,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      } else {
        for (let j = 0; j < eachUserTweetsCount; j++) {
          // Each tweet has 3 replies
          repliedTweets.push({
            UserId: users[Math.floor(Math.random() * users.length)].id,
            TweetId: tweets[i - users.length].id,
            comment,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
    }
    await queryInterface.bulkInsert('Replies', repliedTweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
