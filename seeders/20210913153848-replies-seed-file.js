'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add altering commands here.
    const data = []

    for (let i = 0; i < 50; i++) {
      const users = []
      let userId
      // 每篇 post 有隨機 3 個留言者，每個人有 1 則留言
      for (let i = 1; i <= 3; i++) {
        do {
          // 5 個一般使用者
          userId = Math.floor(Math.random() * 5) + 1
        } while (users.includes(userId))
        users.push(userId)
      }

      data.push(
        ...Array.from({ length: 3 }).map((_, j) => ({
          UserId: users[j] * 10 + 1,
          TweetId: i * 10 + 1,
          comment: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )
    }

    return queryInterface.bulkInsert('Replies', data)
  },

  down: (queryInterface, Sequelize) => {
    // Add reverting commands here.
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
