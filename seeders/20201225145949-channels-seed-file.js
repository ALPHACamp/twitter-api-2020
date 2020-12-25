'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const channels = [
        { UserOne: 2, UserTwo: 3, createdAt: new Date(), updatedAt: new Date() },
        { UserOne: 2, UserTwo: 4, createdAt: new Date(), updatedAt: new Date() }
      ]
      await queryInterface.bulkInsert('Channels', channels)
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Channels', {})
    } catch (error) {
      console.log(error)
    }
  }
};
