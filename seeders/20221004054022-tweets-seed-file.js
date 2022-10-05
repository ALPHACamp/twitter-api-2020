'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const usersLength = users.length // number of the seed users
    const bulkAmount = usersLength * 10 // tweets per user
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: bulkAmount }, (_element, index) => ({
        description: faker.lorem.sentence(Math.floor(Math.random() * 140) + 1),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[index % usersLength].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
