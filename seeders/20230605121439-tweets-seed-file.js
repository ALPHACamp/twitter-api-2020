'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const usersTweets = []
    users.forEach(user => usersTweets.push(
      ...Array.from({ length: 10 }, () => ({
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: user.id
      }))
    ))

    await queryInterface.bulkInsert('Tweets', usersTweets, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
