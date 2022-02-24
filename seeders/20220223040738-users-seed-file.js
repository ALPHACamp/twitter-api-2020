'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      const adminUser = {
        account: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'root',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const users = await Promise.all(Array.from({length: 5}).map(async (_, i) => ({
        account: `user${i+1}`,
        email: `user${i+1}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        name: `user${i+1}`,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      )

      await queryInterface.bulkInsert('Users', [adminUser, ...users], {})

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
