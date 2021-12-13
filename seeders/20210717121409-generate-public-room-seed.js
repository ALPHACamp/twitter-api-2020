'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const publicRoom = [{
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]
    await queryInterface.bulkInsert("Rooms", publicRoom, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Rooms", null, {});
  }
};
