
module.exports = (data) => {
  if (data.name && data.account && data.email && data.password && data.checkPassword) {
    const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    if (emailRule.test(data.email) && (data.password === data.checkPassword)) {
      return true
    }
  }
  return false
}