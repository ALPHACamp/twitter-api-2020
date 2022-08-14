'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.addColumn('Users', 'tweetsNum', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Users', 'repliesNum', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Users', 'likesNum', {
        type: Sequelize.INTEGER
      })
    ])
  },

  async down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.removeColumn('Users', 'tweetsNum'),
      queryInterface.removeColumn('Users', 'repliesNum'),
      queryInterface.removeColumn('Users', 'likesNum')
    ])
  }
};
