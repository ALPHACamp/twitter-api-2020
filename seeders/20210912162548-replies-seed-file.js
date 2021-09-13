'use strict'
const faker = require('faker')
// 每篇 post 有隨機 3 個留言者
const totalUserId = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91]
const randomUserId = []

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 300 }).map((d, index) => {
        if (!randomUserId.length) {
          while (randomUserId.length < 3) {
            const i = Math.floor(Math.random() * totalUserId.length)
            if (!randomUserId.includes(totalUserId[i])) {
              randomUserId.push(totalUserId[i])
            }
          }
        }
        const i = Math.floor(Math.random() * randomUserId.length)
        const id = randomUserId[i]
        randomUserId.splice(i, 1)
        return ({
          id: index * 10 + 1,
          UserId: id,
          TweetId: Math.floor(index / 3) * 10 + 1,
          comment: faker.lorem.sentence(3),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
