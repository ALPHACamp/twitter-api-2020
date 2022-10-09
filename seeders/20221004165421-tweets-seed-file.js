'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先查詢目前user的id
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Tweets', Array.from({ length: 60 }, (_, i) => ({
      user_id: users[(i % users.length)].id,
      description: faker.lorem.text(),
      created_at: new Date(),
      updated_at: new Date()
    })
    ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
