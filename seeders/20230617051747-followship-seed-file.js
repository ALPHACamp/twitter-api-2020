'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followships = []
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < 3; j++) {

        // let followingIndex = Math.floor(Math.random() * users.length);
        // while (followingIndex === i) {
        //   followingIndex = Math.floor(Math.random() * users.length);
        // }
        let indeces = [...Array(users.length).keys()].filter(index => index !== i)
        let followingIndex = indeces[Math.floor(Math.random() * indeces.length)]
        
        followships.push({
          followerId: users[i].id,
          followingId: users[followingIndex].id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
    await (queryInterface.bulkInsert('Followships', followships))
  },

  down: async (queryInterface, Sequelize) => {
    await (queryInterface.bulkDelete('Followships', {}))
  }
};
