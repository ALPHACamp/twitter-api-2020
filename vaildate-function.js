const validator = require('validator')
const bcrypt = require('bcrypt-nodejs')

function validateData(data) {
  const errors = []
  for (const key in data) {
    data[key] = data[key].trim()
    if (key === 'account') {
      if (!data[key]) errors.push("Account is required")
      if (!validator.isAscii(data[key])) {
        errors.push('Name is accepted only with English and Number');
      }
    }
    if (key === 'email') {
      if (!data[key]) errors.push("Email is required")
      if (!validator.isEmail(data[key])) errors.push('The email doesn\'t fit the email format')
    }
    if (key === 'name') {
      if (!data[key]) errors.push("Name is required")
      if (!validator.isLength(data[key], { min: 0, max: 50 })) errors.push('Name is accepted within 50 characters')
    }
    if (key === 'introduction') {
      if (!validator.isLength(data[key], { min: 0, max: 160 })) errors.push('Introduction is accepted within 160 characters')
    }
    if (key === 'password') {
      if (!data[key]) errors.push("Password is required")
    }

    if (key === 'checkPassword') {
      if (!data[key]) errors.push("CheckPassword is required")
      const { password, checkPassword } = data
      if (password !== checkPassword) errors.push('Two password need to be same')
    }
  }
  if (errors.length) throw new Error([...errors])
  return data
}

function validateUser(user, password) {
  if (!user) throw new Error('帳號不存在！')
  if (user.role && user.role === 'admin') throw new Error('帳號不存在！')
  if (user.password && password) {
    if (!bcrypt.compareSync(password, user.password)) throw new Error('帳號或密碼有誤！')
  }
}

function validateUnique(users, data) {

  users.map(user => {
    if (!user) return 
    if (data.currentUser && user.id === data.currentUser) return
    for (key in data) {
      if (user[key] === data[key]) throw new Error(`${key} 已重複註冊！`)     
    }
  })

}



module.exports = {  
  validateData,
  validateUser,
  validateUnique
}