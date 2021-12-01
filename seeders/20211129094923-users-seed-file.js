'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      name: 'root',
      account:'root',
      cover:'https://cdn.stocksnap.io/img-thumbs/280h/blank-books_JVBPKHJCA3.jpg',
      avatar:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user1',
      account:'user1',
      cover:'https://cdn.stocksnap.io/img-thumbs/280h/hands-open_J1KUHXEDB9.jpg',
      avatar:'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user2',
      account:'user2',
      cover:'https://cdn.stocksnap.io/img-thumbs/280h/journal-desk_MFRLKOXJVH.jpg',
      avatar:'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 31,
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user3',
      account:'user3',
      cover:'https://cdn.stocksnap.io/img-thumbs/280h/cosina-analogue_ELZU79WHYI.jpg',
      avatar:'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 41,
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user4',
      account:'user4',
      cover:'https://cdn.stocksnap.io/img-thumbs/280h/book-notebook_VZ86EDZ771.jpg',
      avatar:'https://images.unsplash.com/photo-1628890920690-9e29d0019b9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 51,
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user5',
      account:'user5',
      cover:'https://cdn.stocksnap.io/img-thumbs/280h/snow-winter_8AIPH8FZNX.jpg',
      avatar:'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      introduction: faker.lorem.text().substring(0, 50),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}