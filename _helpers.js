const fs = require('fs')
const { ImgurClient } = require('imgur')

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const imgur = new ImgurClient({ clientId: IMGUR_CLIENT_ID });

// Imgur 檔案上傳
const imgurFileHandler = async file => {
  const response = await imgur.upload({
    image: fs.createReadStream(file.path),
    type: 'stream'
  })
  return response.data
}

function getUser(req) {
  return req.user;
}


module.exports = {
  getUser,
  imgurFileHandler
};