'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    function shuffle(arr) {
      const n = arr.length;
      for (let i = n - 1; i > 0; i -= 1) {
        const rand = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[rand]] = [arr[rand], arr[i]];
      }
      return arr
    }
    const followships = []

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE account <> "root";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const length = users.length

    users.map((follower, index) => {
      const userBacklog = users.slice()
      userBacklog.splice(index, 1)
      const selectedCount = Math.floor(Math.random() * length)
      const followings = shuffle(userBacklog).splice(0, selectedCount)
      const followMap = followings.map((following) => ({
        follower_id: follower.id,
        following_id: following.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
      followships.push(...followMap)
    })
    await queryInterface.bulkInsert('Followships', followships, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
