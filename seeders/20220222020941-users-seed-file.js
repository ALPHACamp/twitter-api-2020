'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')
const axios = require('axios')

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

    const RANDOM_USER_API_URL = 'https://randomuser.me/api'
    const DEFAULT_PASSWORD = '12345678'
    // default DEFAULT_USERS_NUMBER is 5
    const DEFAULT_USERS_NUMBER = 15

    // using axios to get some avatar pictures from Random User API
    return axios.get(`${RANDOM_USER_API_URL}?results=${DEFAULT_USERS_NUMBER}`)
      .then(({ data }) => {

        // then start inserting both root and other user accounts into database
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
          ...Array.from({ length: DEFAULT_USERS_NUMBER }, (_, i) => ({
            email: `user${i + 1}@example.com`,
            name: `user${i + 1}`,
            avatar: data.results[i].picture.large,
            introduction: faker.lorem.sentence(),
            account: `user${i + 1}`,
            password: bcrypt.hashSync(DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        ], {})
      })
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
