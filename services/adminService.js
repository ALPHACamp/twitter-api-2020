const bcrypt = require("bcryptjs");
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const { Op } = require('sequelize')
const helpers = require("../_helpers");
const db = require("../models");
const Tweet = db.Tweet;
const Reply = db.Reply;
const User = db.User;
const Like = db.Like;
const Followship = db.Followship;

const adminService = {
  getUsers: (req, res, callback) => {
    console.log(req.body, req.params)
    return User.findAll({ include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }, Like, Tweet] })
      .then(users => {
        // console.log(users.length)
        // const getUsers = users.map((d, i) => {
        //   return i = d
        // })
        // console.log('users',typeof users);
        // console.log("getUser", typeof getUsers);
        // console.log(getUsers);
        callback({
          users: users,
        });
      })
  },
  getUser: (req, res, callback) => {
    return User.findByPk(req.params.id, { include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }, Like, Tweet] })
      .then(user => {
        // console.log(user[0])
        const followersCount = user.Followers.length
        const followingsCount = user.Followings.length
        const tweetsCount = Tweet.length
        const likeCount = Like.length
        callback({
          user: user, followersCount: followersCount, followingsCount: followingsCount, tweetsCount: tweetsCount, likeCount: likeCount
        })
      })
  },
  getTweets: (req, res, callback) => {
    return Tweet.findAll({ include: [Reply, Like, User] })
      .then(tweets => {
        callback({
          tweets: tweets
        })
      })
  },
  deleteTweet: (req, res, callback) => {
    return Tweet.findByPk(req.params.id, { include: [Reply, Like] })
      .then((tweet) => {
        console.log('tweet.Replies', tweet.Replies)
        tweet.Replies.map(reply => {
          console.log('reply.id', reply.id)
          reply.destroy()
        })
        tweet.destroy()
          .then((tweet) => {
            callback({ status: 'success', message: '' })
          })
      })
  },
}

module.exports = adminService