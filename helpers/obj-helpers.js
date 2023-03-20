module.exports = {
  valueTrim: obj => {
    const newObj = {}
    for (const [key, value] of Object.entries(obj)) {
      (typeof value === 'string')
        ? newObj[key] = value.trim()
        : newObj[key] = value
    }
    return newObj
  }
}
