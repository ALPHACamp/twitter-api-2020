'use strict'
const faker = require('faker')
// 5位使用者 每人10則推文 每則推文隨機3人留言 共 150 條留言
function generateReplies () {
  const arr = []
  for (let i = 0; i < 150; i++) {
    arr[i] = {
      comment: faker.lorem.sentence(),
      user_id: Math.floor(Math.random() * 5 + 1),
      tweet_id: i % 50 + 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  }
  return arr
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Replies',
      generateReplies()
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
