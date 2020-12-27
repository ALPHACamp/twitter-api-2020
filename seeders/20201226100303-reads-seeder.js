'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const reads = [
        {
          UserId: 2,
          ChannelId: 1,
          date: new Date(2020, 10, 10, 10, 1, 0)
        },
        {
          UserId: 2,
          ChannelId: 2,
          date: new Date(2020, 10, 10, 10, 1, 0)
        },
        {
          UserId: 3,
          ChannelId: 1,
          date: new Date(2020, 10, 10, 10, 1, 0)
        },
        {
          UserId: 4,
          ChannelId: 2,
          date: new Date(2020, 10, 10, 10, 1, 0)
        }
      ]
      await queryInterface.bulkInsert('Reads', reads)
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Reads', {})
    } catch (error) {
      console.log(error)
    }
  }
};
