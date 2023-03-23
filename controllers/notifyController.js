const db = require('../models')
const Notify = db.Notify

const notifyController = {
  postNoti: (req, res) => {
    const notiSbj = req.user.id
    const notiObj = req.body.id
    Notify.create({
      notiSbj: notiSbj,
      notiObj: notiObj
    })
      .then(notify => {
        return res.json({ status: 'success', message: '' })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  deleteNoti: (req, res) => {
    const notiSbj = req.user.id
    const notiObj = req.params.id
    Notify.findOne({
      where: {
        notiSbj: notiSbj,
        notiObj: notiObj
      }
    })
      .then(notify => {
        notify.destroy()
          .then(() => {
            return res.json({ status: 'success', message: '' })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  }
}

module.exports = notifyController
