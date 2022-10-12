const validator = require('validator')
const { User, Tweet, Reply, Like } = require('./models')



function validateData(data) {
  const errors = []
  for (const key in data) {
    data[key] = data[key].trim()

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




module.exports = {
  validateData
  
}