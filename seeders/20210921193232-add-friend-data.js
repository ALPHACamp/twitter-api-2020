'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('friendships',
      Array.from({ length: 12 }).map((item, index) =>
      ({
        adder: Math.floor(Math.random() * 6),
        added: Math.floor(Math.random() * 6),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      )
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('firendships', null, {})
  }
};
