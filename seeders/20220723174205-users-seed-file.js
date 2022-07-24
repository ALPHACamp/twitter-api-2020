'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        account: 'test',
        email: 'test',
        password: await bcrypt.hash('test', 10),
        name: 'test',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'test2',
        email: 'test2',
        password: await bcrypt.hash('test2', 10),
        name: 'test2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account: 'test3',
        email: 'test3',
        password: await bcrypt.hash('test3', 10),
        name: 'test3',
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
};
