'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      //先過濾掉role=admin, 只留下純users
      "SELECT id FROM Users WHERE role <> 'admin'",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const tweets = [] 
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      for (let j = 0; j < 10; j++) {
        tweets.push({
          UserId: user.id,
          description: faker.lorem.text(150),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    await queryInterface.bulkInsert('Tweets',tweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
