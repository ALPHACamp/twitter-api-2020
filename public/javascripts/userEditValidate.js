const bcrypt = require('bcryptjs')

module.exports = (data) => {
  if (data.name && data.account && data.email && data.password && data.checkPassword) {
    const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    if (emailRule.test(data.email) && (data.password === data.checkPassword)) {
      data.password = bcrypt.hash(password, bcrypt.genSalt(10))
      return {
        'name': data.name,
        'account': data.account,
        'email': data.email,
        'password': data.password
      }
    }
    return false
  }
  return false
}