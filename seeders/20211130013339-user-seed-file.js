'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mockAdmin = {
      id: 6 * 10,
      account: 'root',
      email: 'root@example.com',
      password: '12345678',
      name: 'root',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const mockUsers = Array.from({ length: 5 }).map((d, i) => ({
      id: Number(i + 1) * 10,
      account: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: `${i + 1}`,
      name: `user${i + 1}`,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    await queryInterface.bulkInsert('Users', [...mockUsers, mockAdmin])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
