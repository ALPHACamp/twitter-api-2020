'use strict'
const faker = require('faker')
function generateTweets () {
  const arr = []
  for (let i = 0; i < 60; i++) {
    arr[i] = {
      description: faker.lorem.sentence(),
      user_id: i % 6 + 1,
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
