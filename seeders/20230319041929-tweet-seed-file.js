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
        const randomOffset = Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)
        tweets.push({
          description: faker.lorem.lines(1),
          created_at: new Date(Date.now() - randomOffset).toISOString().replace('T', ' ').replace('Z', ''),
          updated_at: new Date(Date.now() - randomOffset).toISOString().replace('T', ' ').replace('Z', ''),
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
