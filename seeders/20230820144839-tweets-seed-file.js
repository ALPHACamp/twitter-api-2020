'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM `Users`;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    let list = []
    for (let i in users) {
      for (let j = 0; j < 10; j++) {
        list.push(users[i].id)
      }
    }
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: list.length }, (_, index) => ({
        userId: list[index],
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
};
