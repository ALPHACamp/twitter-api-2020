'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Tweets',
      users.slice(0, 5).reduce((accum, user) => {
        const userTweets = Array.from({ length: 10 }, () => ({
          UserId: user.id,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
        return accum.concat(userTweets)
      }, [])
    )
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Tweets', {})
    await queryInterface.sequelize.query('ALTER TABLE Tweets AUTO_INCREMENT = 1')
  }
}
