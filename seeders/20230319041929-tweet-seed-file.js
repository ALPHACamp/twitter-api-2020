'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = []
    users.shift()
    users.forEach(user => {
      for (let i = 0; i < 10; i++) {
        tweets.push({
          description: faker.lorem.lines(1),
          created_at: new Date(),
          updated_at: new Date(),
          user_id: user.id
        })
      }
    })

    await queryInterface.bulkInsert('Tweets', tweets
    )
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Tweets', {})
  }
}
