'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Chatmessages', 'ChatUserId', {
      type: Sequelize.INTEGER,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Chatmessages', 'ChatUserId')
  }
};
