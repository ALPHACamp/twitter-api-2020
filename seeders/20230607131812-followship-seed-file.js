// 再討論一下有沒有需要這個seed
// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const followers = await queryInterface.Sequelize.query(
//       'SELECT id FROM Users;',
//       { type: queryInterface.sequelize.QueryTypes.SELECT }
//     )
//     while (i < followers.length) {
//       const follows = await queryInterface.Sequelize.bulkInsert('Followships',
//         [{
//           followerId: Math.floor(Math.random()* followers.length),
//           followingId: Math.floor(Math.random() * followers.length)
//         }]
//    )
//   }
// },

//   down: async (queryInterface, Sequelize) => {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//   }
// };
