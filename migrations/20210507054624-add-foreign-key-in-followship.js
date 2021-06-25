'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Followships', {
      fields: ['followerId'],
      type: 'foreign key',
      name: 'followerId_fk_user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('Followships', {
      fields: ['followingId'],
      type: 'foreign key',
      name: 'followingId_fk_user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'Followships',
      'followerId_fk_user_id'
    )
    await queryInterface.removeConstraint(
      'Followships',
      'followingId_fk_user_id'
    )
  }
}
