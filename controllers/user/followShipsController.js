const { assert } = require("chai");
const { User, Followship } = require("../../models");
const { getUser } = require("../../_helpers");
const assert = require("assert");
const followShipsCotroller = {
  postFollow: async (res, req, next) => {
    const followerId = getUser.id;
    const followingId = req.params;
    try {
      const [follower, following] = await Promise.all([
        User.findByPk(followerId),
        User.findByPk(followingId),
      ]);
      assert(follower);
      assert(following);
    } catch (error) {
      next(error);
    }
  },
  deleteFollow: (res, req, next) => {},
};
