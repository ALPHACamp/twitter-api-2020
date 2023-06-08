'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }, (v, i) => ({
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[Math.floor(i / 10)].id, // 每個tweets照順序分配10個tweets
        number_like: Math.floor(Math.random() * 10),
        number_unlike: Math.floor(Math.random() * 10)
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
};
