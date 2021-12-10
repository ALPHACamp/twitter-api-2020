'use strict';
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Followships',
      //每位使用者追蹤2-3位使用者
      [51, 51, 51, 11, 11, 21, 21, 31, 31, 41, 41, 41].map((d, i) => ({
        followingId: [41, 31, 11, 31, 21, 31, 51, 11, 21, 21, 11, 31][i],
        followerId: d,
        createdAt: faker.date.recent(10),
        updatedAt: new Date()
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Followships', null, {})
  }
};
