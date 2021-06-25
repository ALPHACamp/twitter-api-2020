'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('JoinRooms', {
      fields: ['ChatRoomId'],
      type: 'foreign key',
      name: 'joinrooms_fk_chatroom_id',
      references: {
        table: 'ChatRooms',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('JoinRooms', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'joinrooms_fk_user_id',
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
      'JoinRooms',
      'joinrooms_fk_chatroom_id'
    )
    await queryInterface.removeConstraint('JoinRooms', 'joinrooms_fk_user_id')
  }
}
