'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followships = []

    for (let i = 0; i < users.length; i++) {
      let indeces = [...Array(users.length).keys()].filter(index => index !== i)
      for (let j = 0; j < 3; j++) {
        let randomIndex = Math.floor(Math.random() * indeces.length)
        let followingIndex = indeces[randomIndex]
        followships.push({
          followerId: users[i].id,
          followingId: users[followingIndex].id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        indeces.splice(randomIndex, 1)
      }
    }
    await (queryInterface.bulkInsert('Followships', followships))
  },

  down: async (queryInterface, Sequelize) => {
    await (queryInterface.bulkDelete('Followships', {}))
  }
};
