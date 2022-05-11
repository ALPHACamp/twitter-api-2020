'use strict'
const faker = require('faker')
// 5位使用者 每人10則推文 共50則推文
function generateTweets () {
  const arr = []
  for (let i = 0; i < 50; i++) {
    arr[i] = {
      id: i + 1,
      description: faker.lorem.sentence(),
      user_id: i % 5 + 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  }
  return arr
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tweets',
      generateTweets()
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
