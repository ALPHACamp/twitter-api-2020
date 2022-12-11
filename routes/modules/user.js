const express = require('express')
const router = express.Router()
const { User, Tweet, Reply, Like } = require('../../models')

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id, {
      raw: true
    })

    //  刪除密碼
    delete user.password
    res.json({
      user
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
