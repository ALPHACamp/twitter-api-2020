const bcrypt = require('bcryptjs')
const helpers = require('../../_helpers')
const { User, Tweet } = require('../../models')
const jwt = require('jsonwebtoken');


let adminController = {
  signIn: (req, res) => {
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: "請填寫完整資料" })
    }

    const account = req.body.account;
    const password = req.body.password;

    User.findOne({ where: { account } })
      .then((user) => {
        if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' });
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: 'passwords did not match' });
        }

        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)

        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            role: user.role,
          },
        });
      })
      .catch((error) => res.send(error));
  },

  getUsers: (req, res) => {
    User.findAll({
      // include:[Like, Followship, Reply]
    })
  },
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.dataValues.description.substring(0, 50),
        }))
        return res.json(data)
      })
  }
}

module.exports = adminController