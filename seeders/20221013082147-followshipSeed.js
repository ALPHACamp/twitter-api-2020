'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const followship =[]
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;', 
      { type: queryInterface.sequelize.QueryTypes.SELECT })

    users.forEach(user => {users.map(following => {
        if (following.id > user.id) {followship.push({
            follower_id: user.id,
            following_id: following.id,
            created_at: faker.date.between('2022-07-05T00:00:00.000Z', '2022-08-05T00:00:00.000Z'),
            updated_at: new Date()
          })
        }
      })
    })
    queryInterface.bulkInsert('Followships', followship)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}