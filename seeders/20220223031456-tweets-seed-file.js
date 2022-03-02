'use strict';

const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    users.shift()

    for ( const user of users) {
      // 更改推文種子數
      await queryInterface.bulkInsert('Tweets', 
        Array.from({ length: 10 }, () => ({
        description: faker.lorem.text(140),
        UserId: user.id,
        createdAt: faker.date.recent(30),
        updatedAt: new Date()
        }))
      )  
      }
 },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
