'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM Users WHERE role = ?',
      {
        replacements: ['user'],
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 10 }, () => ({
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        UserId:
          users[Math.floor(Math.random() * users.length)].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
