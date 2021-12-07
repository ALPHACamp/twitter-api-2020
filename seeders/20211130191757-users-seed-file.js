'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

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
      ...Array.from({ length: 5 }).map((d, i) => ({
        email: `user${i}@example.com`,
        password: bcrypt.hashSync('23456789', bcrypt.genSaltSync(10), null),
        name: faker.name.findName(),
        avatar: 'https://loremflickr.com/320/240/face',
        account: `user${i+1}`,
        cover: 'https://loremflickr.com/1200/400/landscape',
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {
        email: 'root@example.com',
        account: 'root',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
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
