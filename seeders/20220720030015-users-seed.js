'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')

const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

module.exports = {
  async up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    // 新增 admin 種子資料
    await queryInterface.bulkInsert('Users',
      [{
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      }]
      , {})
    // 新增 user 種子資料
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 3 }).map((item, index) => {
        let name = faker.name.firstName()
        return ({
          name: name,
          email: name + '@aa.com',
          password: bcrypt.hashSync(name, bcrypt.genSaltSync(10)),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
      )
      , {})
  },

  async down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Users', null, {})
  }
};
