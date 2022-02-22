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
   return queryInterface.sequelize.query(
     `SELECT * FROM Users WHERE role='user'`,
     { type: queryInterface.sequelize.QueryTypes.SELECT }
   )
    .then(users => {
      const tweetsArray = users.flatMap(user => {
        return Array.from({ length: 10 }, () => ({
          UserId: user.id,
          description: faker.lorem.paragraph(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      })

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
          totalTweets: 10,
          createdAt,
          updatedAt: new Date()
        }
      })

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
