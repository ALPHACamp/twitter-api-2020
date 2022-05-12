'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const identities = [
      {
        identity: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        identity: 'user',
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
