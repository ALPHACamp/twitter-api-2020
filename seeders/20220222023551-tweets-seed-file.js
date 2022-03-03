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

    const DEFAULT_TWEETS_NUMBER = 10

    // retrieve all user data from database except for admin
    return queryInterface.sequelize.query(
      `SELECT * FROM Users WHERE role='user'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
      .then(users => {
        // prepare an array of all tweet data
        const tweetsArray = []
        users.forEach(user => {
          tweetsArray.push(...Array.from({ length: DEFAULT_TWEETS_NUMBER }, () => ({
            UserId: user.id,
            description: faker.lorem.sentence(),
            createdAt: faker.date.past(),
            updatedAt: new Date()
          })))
        })

        // prepare an array of all user data
        // and update totalTweets and updatedAt fields
        const usersArray = users.map(user => {
          const { 
            id, email, name, account, password, role, createdAt 
          } = user

          return {
            id,
            email,
            name,
            account,
            password,
            role,
            totalTweets: DEFAULT_TWEETS_NUMBER,
            createdAt,
            updatedAt: new Date()
          }
        })

        // execute two database commands at the same time
        return Promise.all([
          queryInterface.bulkInsert('Tweets', tweetsArray, {}),
          queryInterface.bulkInsert('Users', usersArray, {
            updateOnDuplicate: ['totalTweets', 'updatedAt']
          })
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

    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
