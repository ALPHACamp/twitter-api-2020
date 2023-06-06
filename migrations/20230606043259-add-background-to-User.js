'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'background', {
      type: Sequelize.STRING,
      defaultValue: 'https://images.pexels.com/photos/12993530/pexels-photo-12993530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'background')
  }
}
