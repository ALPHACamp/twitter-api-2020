
const userController = {
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/main')
  }
}

module.exports = userController