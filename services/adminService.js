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
    return Users.findAll({ include: Followship })
    .then(users => {
      console.log(users[0])
      callback({
        users: users
      })
    })
  },
  deleteTweet: (req, res, callback) => {
    return Tweet.findByPk(req.params.id, {include:[Reply, Like]})
      .then((tweet) => {
        console.log('tweet.Replies', tweet.Reply)
        tweet.Replies.map(reply => {
          console.log('comment.id', reply.id)
          reply.destroy()
        })
        tweet.destroy()
          .then((tweet) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = adminService