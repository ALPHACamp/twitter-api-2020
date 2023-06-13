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

    await queryInterface.bulkInsert('Likes',
      Array.from({ length: totalLikes }, (_, index) => ({
        // 預設每個user有3個 likes
        UserId: users[Math.floor(index / DEFAULT_EACH_USER_LIKES)].id,
        TweetId: tweets[index].id,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
