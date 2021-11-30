'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mockAdmin = {
      id: 1,
      account: 'root',
      email: 'root@example.com',
      password: '12345678',
      name: 'root',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const mockUsers = Array.from({ length: 5 }).map((d, i) => ({
      id: Number(i + 2),
      account: `user${i + 2}`,
      email: `user${i + 2}@example.com`,
      password: `${i + 2}`,
      name: `user${i + 2}`,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    await queryInterface.bulkInsert('Users', [mockAdmin, ...mockUsers])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
