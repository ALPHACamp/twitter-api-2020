'use strict';

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
   return queryInterface.bulkInsert('Users', [
     {
       email: 'root@example.com',
       name: 'root',
       account: 'root',
       password: '12345678',
       role: 'admin',
       createdAt: new Date(),
       updatedAt: new Date()
     },
     ...Array.from({ length: 5 }, (_, i) => ({
       email: `user${i + 1}@example.com`,
       name: `user${i + 1}`,
       account: `user${i + 1}`,
       password: '12345678',
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
