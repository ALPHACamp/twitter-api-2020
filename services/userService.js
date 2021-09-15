const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { User, Tweet, Reply, Like, Followship, Sequelize } = require("../models");
const sequelize = require("sequelize");




const userService = {
  signUp : async (account, email, password) => {
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
  getCurrentUser: async (userId) => {
    const currentUser = await User.findOne({
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
      // include: [
      //   { model: User, as: "Followings" },
      //   { model: User, as: "Followers" },
      //   { model: Tweet },
      // ],
    });

    return currentUser
  },
  putUserProfile: async (id, file, body) => {
    const user = await User.findByPk(id)
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        const updatedUser = user.update({
          ...body, 
          avatar: file ? img.data.link : user.avatar, })
        return {
          status: 'success', message: 'successfully edited', updatedUser
        }
      })
    }
    console.log(body)
    const updatedUser = await user.update({ ...body, avatar: user.avatar })
    return { status: 'success', message: 'successfully edited', updatedUser }
  }
}

module.exports = userService
