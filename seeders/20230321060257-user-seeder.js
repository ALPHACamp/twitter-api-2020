'use strict'
const bcrypt = require('bcryptjs')
const userAmount = 5

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      account: 'root',
      name: 'root',
      avatar: `https://loremflickr.com/320/240/avatar/?random=${Math.random() * 100}`,
      role: 'admin',
      image: 'https://i.imgur.com/gerdVUX.png',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
      .then(() => queryInterface.bulkInsert('Users',
        Array.from({ length: userAmount }).map((_, i) =>
          ({
            email: `user${i}@example.com`,
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
            account: `user${i}`,
            name: `user${i}`,
            avatar: `https://loremflickr.com/320/240/avatar/?random=${Math.random() * 100}`,
            introduction: 'This is only a demo introduction~~~',
            role: 'user',
            image: 'https://i.imgur.com/gerdVUX.png',
            created_at: new Date(Date.now() + (i + 1) * 1000),
            updated_at: new Date(Date.now() + (i + 1) * 1000)
          })
        ), {}))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
