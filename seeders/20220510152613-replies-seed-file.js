'use strict'
const faker = require('faker')
function generateReplies () {
  const arr = []
  for (let i = 0; i < 180; i++) {
    arr[i] = {
      comment: faker.lorem.sentence(),
      user_id: i % 6 + 1,
      tweet_id: i % 60 + 1,
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
