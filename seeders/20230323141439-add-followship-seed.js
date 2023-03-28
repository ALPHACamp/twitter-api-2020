"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const followships = [];
    // - 每人隨機追蹤其他三位使用者
    users.forEach((user, index) => {
      let others = users.filter((u) => u.id !== user.id);
      for (let i = 0; i < 3; i += 1) {
        const randomIndex = Math.floor(Math.random() * others.length);
        const followship = {
          followerId: users[index].id,
          followingId: others[randomIndex].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        followships.push(followship);
        others.splice(randomIndex, 1) // - 剔除選中的 user
      }
    });
    await queryInterface.bulkInsert("Followships", followships, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Followships", null, {});
  },
};
