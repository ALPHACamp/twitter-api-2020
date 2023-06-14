'use strict'
const DEFAULT_EACH_USER_LIKES = 2
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
    const totalLikes = users.length * DEFAULT_EACH_USER_LIKES
    let tweetArray = tweets
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: totalLikes }, (_, index) => {
        // 預設每個user有2個 likes
        const remind = index % DEFAULT_EACH_USER_LIKES
        if (remind === 0) tweetArray = tweets
        const tweet = tweetArray[Math.floor(Math.random() * tweetArray.length)].id
        tweetArray = tweetArray.filter(t => t.id !== tweet)
        return {
          UserId: users[Math.floor(index / DEFAULT_EACH_USER_LIKES)].id,
          TweetId: tweet,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent()
        }
      }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
