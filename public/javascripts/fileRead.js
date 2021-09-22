const fs = require('fs')

function readFile (file) {
  fs.readFile(file.path, async(err, data) => {
    if (err) { console.log(err) }
    await fs.writeFile(`upload/${file.originalname}`, data, err => {
      if (err) { console.log(err) }
    })
    return `upload/${file.originalname}`
  })
}

module.exports = readFile