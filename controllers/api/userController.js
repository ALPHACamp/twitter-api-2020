const bcrypt = require('bcryptjs')
const db = require('../../models/index')
const User = db.User

module.exports = {
  register: async (req, res) => { //body: email, password, passwordCheck
    try {
      const { account, email, password, passwordCheck, name } = req.body
      //make sure no empty input
      if (!account || !email || !password || !passwordCheck || !name) return res.status(400).json({ status: 'error', message:'所有欄位都是必填的!!!' })
      //check password confirmation
      if (passwordCheck !== password) return res.status(400).json({ status: 'error', message:'兩次密碼輸入不同!!!' })
      //check if account used already
      const existedAccount = await User.findOne({ where: { account } }).catch((err) => console.log('existedAccount: ', err))
      if (existedAccount) return res.status(400).json({ status: 'error', message:'此帳號已被使用!!!' })
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
          return res.status(400).json({ status: 'error', message:'創建帳號失敗，請稍後再試，有任何問題請聯繫客服人員。' })
      }
    } catch(err) {
      console.log('catch block: ', err)
      return res.status(400).json({ status: 'error', message:'伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

}