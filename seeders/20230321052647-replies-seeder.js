'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先篩選出一般使用者
    const users = await queryInterface.sequelize.query(
      "SELECT `id` FROM `users` WHERE `role` = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    // 先篩選出推文
    const tweets = await queryInterface.sequelize.query(
      'SELECT `id` FROM `tweets`;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })

    const replyCounts = 3 // 預設每則推文的留言數

    for (let i = 0; i < tweets.length; i++) {
      const currentUser = [...users]
      await queryInterface.bulkInsert('Replies',
        Array.from({ length: replyCounts }).map(() => {
          const randomUserIndex = Math.floor(Math.random() * currentUser.length) // 隨機使用者index
          const randomUser = currentUser[randomUserIndex] // 隨機使用者
          currentUser.splice(randomUserIndex, 1) // 去除已經留言過的使用者, 避免重複留言
          return {
            UserId: randomUser.id,
            TweetId: tweets[i].id,
            comment: faker.lorem.word(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
        )
        , {})
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', {})
  }
}
