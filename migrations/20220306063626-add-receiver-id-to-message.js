'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Message', 'receiverId', {
      type: Sequelize.INTEGER
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Message', 'receiverId')
  }
}