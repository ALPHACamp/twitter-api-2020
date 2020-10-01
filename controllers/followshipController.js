const helpers = require('../_helpers.js')
const db = require('../models')
const Followship = db.Followship


const followshipController = {
  postFollowing: (req, res) => {
    if (helpers.getUser(req).id === Number(req.body.id)) {
      return res.json({ status: 'error', message: 'Can not follow yourself.' })
    }
    Followship.findOne({ where: { followerId: helpers.getUser(req).id, followingId: req.body.id } })
      .then(data => {
        if (!data) {
          Followship.create({ followerId: helpers.getUser(req).id, followingId: req.body.id })
            .then(() => {
              return res.json({ status: 'success', message: '追蹤成功' })
            })
        } else {
          return res.json({ status: 'error', message: '已有相同資料' })
        }
      })
      .catch(error => res.send(String(error)))
  }
}

module.exports = followshipController