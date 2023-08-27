'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'account', {
      type: Sequelize.STRING
    // 刪除了不允許為空值的限制，這是因為測試檔create並沒有account的寫入，會造成測試檔無法通過
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'account')
  }
}
