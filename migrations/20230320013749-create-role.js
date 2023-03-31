'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Roles', {
      role: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    await queryInterface.bulkInsert('Roles',
      [
        { role: 'user', created_at: new Date(), updated_at: new Date() },
        { role: 'admin', created_at: new Date(), updated_at: new Date() }
      ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles')
  }
}
