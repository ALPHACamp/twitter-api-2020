const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { User, Tweet, Reply, Like, Followship, Sequelize } = require("../models");
const sequelize = require("sequelize");
const { helpers } = require("faker");

const userService = {
  signUp : async (account, name, email, password) => {
    const duplicate_email = await User.findOne({ where: { email } });
    if (duplicate_email) {
      return { status: "error", message: "This email has been registered" };
    }
    const duplicate_account = await User.findOne({ where: { account } });
    if (duplicate_account) {
      return { status: "error", message: "This account name has been registered" };
    }

    const newUser = await User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
    return { status: "success", message: "Successfully sign up"};
  },
  signIn: async (account, password) => {
    const user = await User.findOne({ where: { account } })
    if (!user) {
      return { status: "error", message: "no such user found" };
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return { status: "error", message: "passwords did not match" };
    }
    if (user.role === "admin") {
      return { status: 'error', message: 'This account does not have permission to access'}
    }
    // Give token
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return {
      status: "success",
      message: "Successfully login",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  },
  getUser: async(userId) => {

    const user = await User.findOne({
      raw: true,
      nest: true,
      where: { id: userId },
      attributes: [
        "account",
        "name",
        "avatar",
        "cover",
        "introduction",
        "role",
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM TWEETS WHERE Tweets.UserId = ${userId})`
          ),
          "TweetsCount",
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM FOLLOWSHIPS WHERE Followships.followingId = ${userId})`
          ),
          "FollowersCount",
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM FOLLOWSHIPS WHERE Followships.followerId = ${userId})`
          ),
          "FollowingCount",
        ], 
      ]     
    })
    if (user.role === "admin") {
      return { status: 'error', message: "Can't access admin's profile"}
    }

    return user
  },
  getCurrentUser: async (userId) => {
    const currentUser = await User.findOne({
      raw: true,
      nest: true,
      where: { id: userId },
      attributes: [
        "account",
        "name",
        "email",
        "avatar",
        "cover",
        "introduction",
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM TWEETS WHERE Tweets.UserId = ${userId})`
          ),
          "TweetsCount",
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM FOLLOWSHIPS WHERE Followships.followingId = ${userId})`
          ),
          "FollowersCount",
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM FOLLOWSHIPS WHERE Followships.followerId = ${userId})`
          ),
          "FollowingCount",
        ],
      ],
    });
    currentUser.isCurrent = true 
    return currentUser
  },
  putUser: async (id, files, body) => {
    const user = await User.findByPk(id)

    if (files) {
      imgur.setClientId(IMGUR_CLIENT_ID);
      const avatar = files.avatar ? await imgur.uploadFile((files.avatar[0].path)) : null
      const cover = files.cover ? await imgur.uploadFile((files.cover[0].path)) : null

      await user.update({
        ...body,
        avatar: files.avatar ? avatar.link : user.avatar,
        cover: files.cover ? cover.link : user.cover
      })
      return {
        status: 'success',
        message: 'Successfully edited'
      }
    }
    await user.update({ ...body, avatar: user.avatar, cover: user.cover })
    return { status: 'success', message: 'successfully edited' }
  }
}

module.exports = userService
