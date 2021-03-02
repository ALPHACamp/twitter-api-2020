const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../../models/index')
const helpers = require('../../_helpers')
const User = db.User

module.exports = {
  getUser: async (req, res) => {
    const { id } = req.params
    try {
      //get user
      let user = await User.findOne({ where: { id } }).catch((err) => console.log('getUser: ', err))
      //check if user exists
      if (!user) return res.status(400).json({ status: 'error', message: '此用戶不存在。' })
      user = user.toJSON()
      //check role
      const role = helpers.getUser(req).role
      if(role === 'admin') {
        return res.json(user)
      } else if (role === 'user') {
        return res.json({ ...user, password: '' })
      }

    } catch(err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message:'伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  register: async (req, res) => { //body: email, password, checkPassword
    const { account, email, password, checkPassword, name } = req.body
    try {
      //make sure no empty input
      if (!account || !email || !password || !checkPassword || !name) return res.status(400).json({ status: 'error', message:'所有欄位都是必填的!!!' })
      //check password confirmation
      if (checkPassword !== password) return res.status(400).json({ status: 'error', message:'兩次密碼輸入不同!!!', name, account, email, password, checkPassword })
      //check if account used already
      const existedAccount = await User.findOne({ where: { account } }).catch((err) => console.log('existedAccount: ', err))
      if (existedAccount) return res.status(400).json({ status: 'error', message:'此帳號已被使用!!!', name, account, email, password, checkPassword })
      //account hasn't been used ^__^ create user
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(password, salt)
      const newUser = await User.create({
        account: account,
        email: email,
        password: hashedPassword,
        name: name,
        role: 'user',
        introduction: '',
        avatar: ''
      }).catch((err) => console.log('newUser: ', err))
      //if user successfully created?
      switch(!!newUser) {
        case true:
          return res.json({ status: 'success', message:'成功創建帳號!!!' })
        case false: 
          return res.status(400).json({ status: 'error', message:'創建帳號失敗，請稍後再試，有任何問題請聯繫客服人員。', name, account, email, password, checkPassword })
      }
    } catch(err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message:'伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。', name, account, email, password, checkPassword })
    }
  },

  login: async (req, res) => {
    const { account, password } = req.body
    try {
      //check input
      if (!account || !password) return res.status(400).json({ status: 'error', message:'所有欄位都要填!!!', account, password })
      //check if user exists
      let user = await User.findOne({ where: { account } }).catch((err) => console.log('existedAccount: ', err))
      if (!user) return res.status(400).json({ status: 'error', message:'此帳號不存在!!!', account, password })
      user = user.toJSON()
      //check if password correct
      if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ status: 'error', message:'密碼錯誤!!!', account, password })
      //sign and send jwt
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({ 
        status: 'success',
        message: '成功登入!!!',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role  }
      })
    } catch(err) {
      console.log('catch block: ', err)
      return res.status(500).json({ status: 'error', message:'伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。', account, password })
    }
  }
}