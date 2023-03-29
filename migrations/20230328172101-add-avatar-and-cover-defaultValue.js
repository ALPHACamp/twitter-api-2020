'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.changeColumn('Users', 'avatar', {
        type: Sequelize.STRING,
        defaultValue:
          'https://live.staticflickr.com/65535/52777903968_c0460ba4d6_z.jpg',
        allowNull: false
      })
      await queryInterface.changeColumn('Users', 'cover', {
        type: Sequelize.STRING,
        defaultValue:
          'https://live.staticflickr.com/65535/52777507974_aa5dcee4aa_z.jpg',
        allowNull: false
      })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.changeColumn("Users", "avatar", {
        type: Sequelize.STRING,
        allowNull: false,
      });
      await queryInterface.changeColumn("Users", "cover", {
        type: Sequelize.STRING,
        allowNull: false,
      });
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
