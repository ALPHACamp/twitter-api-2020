'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'cover', {
      type: Sequelize.STRING,
      defaultValue: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Romance_of_the_Western_Chamber_poster.jpg"
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'cover')
  }
}
