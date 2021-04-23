const validator = require('validator')
const { catchError } = require('../utils/errorHandling')
const db = require('../models/index')
const User = db.User
const Followship = db.Followship

module.exports = {
  follow: (req, res) => {
    const { id } = req.body
    const followerId = req.user.id.toString()
    if (!id) {
      const data = { status: 'error', message: 'Please fill out the id field.' }
      return res.status(400).json(data)
    }
    if (id === followerId) {
      const data = { status: 'error', message: 'Cannot follow yourself.' }
      return res.status(400).json(data)
    }
    if (!validator.isNumeric(id, { no_symbols: true })) {
      const data = { status: 'error', message: 'Wrong id format.' }
      return res.status(400).json(data)
    }
    return User.findByPk(id, { raw: true })
      .then((user) => {
        if (!user) {
          const data = { status: 'error', message: 'The user you want to follow dose not exist.' }
          return res.status(404).json(data)
        }
        if (user.role === 'admin') {
          const data = { status: 'error', message: 'Cannot follow administrator.' }
          return res.status(400).json(data)
        }
        User.findByPk(followerId, { include: { model: User, as: 'Followings' }, attributes: [] })
          .then(user => {
            const followings = user.Followings.map(following => following.dataValues.id.toString())
            if (followings.includes(id)) {
              const data = { status: 'error', message: 'You have already followed this user.' }
              return res.status(400).json(data)
            }

            Followship.create({
              followerId,
              followingId: id
            })
              .then(() => {
                const data = { status: 'success', message: 'Done.' }
                res.status(200).json(data)
              })
              .catch(error => {
                catchError(res, error)
              })
          })
          .catch(error => {
            catchError(res, error)
          })
      })
      .catch(error => {
        catchError(res, error)
      })
  }
}
