'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE role = "user";', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const followArray = []
    users.forEach(user => {
      users.map(following => {
        if (following.id >  user.id) {
          followArray.push({
            follower_id: user.id,
            following_id: following.id,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      })
    })
    queryInterface.bulkInsert('Followships', followArray)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}




// 'use strict'

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
//     queryInterface.bulkInsert('Followships', Array.from({ length: users.length * 3 }, (_, i) => ({
//       follower_id: users[i % users.length].id,
//       following_id: users?.filter(u => u.id !== this.follower_id)[Math.floor(Math.random() * (users.length - 2))]?.id,
//       created_at: new Date(),
//       updated_at: new Date()
//     }))
//     )
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Followships', null, {})
//   }
// }