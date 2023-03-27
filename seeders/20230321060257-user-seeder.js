'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'root@example.com',
      name: 'root',
      avatar: `https://loremflickr.com/320/240/avatar/?random=${Math.random() * 100}`,
      role: 'admin',
      image: 'https://i.imgur.com/gerdVUX.png',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
      .then(() => queryInterface.bulkInsert('Users',
        Array.from({ length: 5 }).map((_, i) =>
          ({
            email: `user${i}@example.com`,
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
            account: `user${i}@example.com`,
            name: `user${i}`,
            avatar: `https://loremflickr.com/320/240/avatar/?random=${Math.random() * 100}`,
            role: 'user',
            image: 'https://i.imgur.com/gerdVUX.png',
            created_at: new Date(),
            updated_at: new Date()
          })
        ), {}))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
