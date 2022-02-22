'use strict';
const faker = require('faker')

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
    const DEFAULT_REPLIES_NUMBER = 3

    // retrieve all user data from database except for admin
    // also retrieve all tweet data from database
    return Promise.all([
      queryInterface.sequelize.query(
        `SELECT * FROM Users WHERE role='user'`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        `SELECT * FROM Tweets`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
      .then(([users, tweets]) => {
        // prepare an array of all reply data
        const repliesArray = tweets.flatMap(tweet => {
          const userSet = new Set()

          return Array.from({ length: DEFAULT_REPLIES_NUMBER }, () => {
            // assign random number to UserId
            let UserId = RANDOM_DEFAULT_NUMBER

            do {
              // generate random UserId
              UserId = users[Math.floor(Math.random() * users.length)].id

              // check if generated UserId matches tweet.UserId
              // or that userId already had one reply in the same tweet
            } while (UserId === tweet.UserId || userSet.has(UserId))

            userSet.add(UserId)

            return {
              UserId,
              TweetId: tweet.id,
              comment: faker.lorem.text(),
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        })

        // prepare an array of all tweet data
        // and update totalReplies and updatedAt fields
        const tweetsArray = tweets.map(tweet => {
          const { id, UserId, description, createdAt } = tweet

          return {
            id,
            UserId,
            description,
            totalReplies: DEFAULT_REPLIES_NUMBER,
            createdAt,
            updatedAt: new Date()
          }
        })

        // execute two database commands at the same time
        return Promise.all([
          queryInterface.bulkInsert('Replies', repliesArray, {}),
          queryInterface.bulkInsert('Tweets', tweetsArray, {
            updateOnDuplicate: ['totalReplies', 'updatedAt']
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

    return queryInterface.bulkDelete('Replies', null, {})
  }
};
