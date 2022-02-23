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
      await queryInterface.bulkInsert('Tweets', 
        Array.from({ length: 10 }, () => ({
        description: faker.lorem.text(140),
        UserId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
        }))
      )  
      }
 },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
