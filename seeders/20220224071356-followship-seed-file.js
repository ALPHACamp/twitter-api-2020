'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    users.shift()
    
    await queryInterface.bulkInsert('Followships', [{
      followerId: users[0].id,
      followingId: users[1].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: users[1].id,
      followingId: users[2].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: users[2].id,
      followingId: users[3].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: users[3].id,
      followingId: users[4].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      followerId: users[4].id,
      followingId: users[0].id,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      followerId: users[3].id,
      followingId: users[0].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
 }
};
