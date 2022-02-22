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
        const repliesArray = tweets.flatMap(tweet => {
          const userSet = new Set()

          return Array.from({ length: 3 }, () => {
            let UserId = 0

            do {
              UserId = users[Math.floor(Math.random() * users.length)].id
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

        const tweetsArray = tweets.map(tweet => {
          const { id, UserId, description, createdAt } = tweet

          return {
            id,
            UserId,
            description,
            totalReplies: 3,
            createdAt,
            updatedAt: new Date()
          }
        })

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
