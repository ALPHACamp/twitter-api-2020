'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE is_admin = false;', // 討論
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 10 }, () => ({
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[0].id
      }))
    )
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 10 }, () => ({
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[1].id
      }))
    )
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 10 }, () => ({
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[2].id
      }))
    )
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 10 }, () => ({
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[3].id
      }))
    )
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 10 }, () => ({
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[4].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
