'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先篩選出一般使用者
    const users = await queryInterface.sequelize.query(
      "SELECT `id` FROM `users` WHERE `role` = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT })

    const tweetCounts = 10 // 預設每個使用者的推文數

    for (let i = 0; i < tweetCounts; i++) {
      await queryInterface.bulkInsert('Tweets',
        users.map(user => ({
          UserId: user.id,
          description: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
        , {})
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', {})
  }
}
