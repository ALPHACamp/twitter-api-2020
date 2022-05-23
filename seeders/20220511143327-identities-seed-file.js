'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const identities = [
      {
        id: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    await queryInterface.bulkInsert('Identities', identities, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Identities', null, {})
  }
}
