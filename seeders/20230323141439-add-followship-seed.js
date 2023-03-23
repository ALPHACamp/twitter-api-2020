"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE account <> 'root'",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const followships = [];
    // - 每人隨機追蹤一名其他使用者
    users.forEach((user, index) => {
      const others = users.filter((u) => u.id !== user.id);
      const randomIndex = Math.floor(Math.random() * others.length);
      const followship = {
        followerId: users[index].id,
        followingId: others[randomIndex].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      followships.push(followship);
    });
    await queryInterface.bulkInsert("Followships", followships, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Followships", null, {});
  },
};
