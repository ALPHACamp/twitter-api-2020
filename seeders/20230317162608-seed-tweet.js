'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role <> "admin"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (let i = 0; i < users.length; i++) {
      await queryInterface.bulkInsert(
        'Tweets',
        Array.from({ length: 10 }, () => ({
          User_id: users[i].id,
          image: `https://loremflickr.com/320/240/?random=${Math.floor(Math.random() * 100)}`,
          description: faker.lorem.sentence(5),
          created_at: new Date(),
          updated_at: new Date()
        }))
      )
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
