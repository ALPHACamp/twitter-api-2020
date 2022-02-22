'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    const DEFAULT_PASSWORD = '12345678'

    return queryInterface.bulkInsert('Users', [
      // root account setting
      {
        email: 'root@example.com',
        name: 'root',
        account: 'root',
        password: bcrypt.hashSync(DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // user account settings as array
      ...Array.from({ length: 5 }, (_, i) => ({
        email: `user${i + 1}@example.com`,
        name: `user${i + 1}`,
        account: `user${i + 1}`,
        password: bcrypt.hashSync(DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    
    return queryInterface.bulkDelete('Users', null, {})
  }
};
