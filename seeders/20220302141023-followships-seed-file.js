'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    const RANDOM_DEFAULT_NUMBER = 0
    const DEFAULT_FOLLOWSHIPS_NUMBER = 3

    // retrieve all user data from database except for admin
    return queryInterface.sequelize.query(
      `SELECT * FROM Users WHERE role='user'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
      .then(users => {
        // prepare an array of all followship data
        const followshipsArray = []
        users.forEach(user => {
          const userSet = new Set()

          followshipsArray.push(...Array.from({ length: DEFAULT_FOLLOWSHIPS_NUMBER }, () => {
            // assign random number to followingId
            let followingId = RANDOM_DEFAULT_NUMBER

            do {
              // generate random followingId
              followingId = users[Math.floor(Math.random() * users.length)].id

              // check if generated followingId matches user.id
              // or that user.id already had one record in the same followship
            } while (followingId === user.id || userSet.has(followingId))

            userSet.add(followingId)

            return {
              followerId: user.id,
              followingId,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }))
        })

        // prepare an array of all user data
        // and update total counts and updatedAt fields
        const usersArray = users.map(user => {
          const { 
            id, email, name, avatar, introduction, account, 
            password, role, totalTweets, totalLiked, createdAt 
          } = user

          let totalFollowers = 0
          followshipsArray.forEach(f => {
            if (f.followingId === user.id) totalFollowers ++
          })

          return {
            id,
            email,
            name,
            avatar,
            introduction,
            account,
            password,
            role,
            totalTweets,
            totalLiked,
            totalFollowings: DEFAULT_FOLLOWSHIPS_NUMBER,
            totalFollowers,
            createdAt,
            updatedAt: new Date()
          }
        })

        // execute two database commands at the same time
        return Promise.all([
          queryInterface.bulkInsert('Followships', followshipsArray, {}),
          queryInterface.bulkInsert('Users', usersArray, {
            updateOnDuplicate: ['totalFollowings', 'totalFollowers', 'updatedAt']
          }),
        ])
      })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    return queryInterface.bulkDelete('Followships', null, {})
  }
};
