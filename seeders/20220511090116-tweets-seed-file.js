'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminId = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role="admin";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // 產生 10 則推文給每位使用者，除了 admin
    for (const u of users) {
      if (!adminId.some(a => a.id === u.id)) {
        await queryInterface.bulkInsert('Tweets',
          Array.from({ length: 10 }, () => ({
            user_id: u.id,
            description: faker.lorem.text().substring(0, 140),
            created_at: new Date(),
            updated_at: new Date()
          }))
        )
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
