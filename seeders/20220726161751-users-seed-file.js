'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = Array.from({ length: 10 }, (_, i) => ({
      account: `user${i + 1}`,
      name: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync('12345678', 10),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }))
    await queryInterface.bulkInsert('Users', [
      {
        account: 'root',
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', 10),
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      ...users
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
