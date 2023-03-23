'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.addColumn('Rooms', 'User1Unread', {
      type: Sequelize.BOOLEAN
    })
    await queryInterface.addColumn('Rooms', 'User1UnreadNum', {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('Rooms', 'User2Unread', {
      type: Sequelize.BOOLEAN
    })
    await queryInterface.addColumn('Rooms', 'User2UnreadNum', {
      type: Sequelize.INTEGER
    })
  },

  async down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.removeColumn('Rooms', 'User1Unread')
    await queryInterface.removeColumn('Rooms', 'User1UnreadNum')
    await queryInterface.removeColumn('Rooms', 'User2Unread')
    await queryInterface.removeColumn('Rooms', 'User2UnreadNum')
  }
};
