'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles',
      [
        { role: 'user', created_at: new Date(), updated_at: new Date() },
        { role: 'admin', created_at: new Date(), updated_at: new Date() }
      ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles')
  }
}
