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
  const data = response.data

  // if data is string , it's error with uploading too many times
  // return minutes number
  if (typeof (data) === 'string' && data.includes('too fast')) {
    const minutes = data.replace(/[^0-9]/ig, "")
    return new Error(`圖片上傳次數過多，請稍候 ${minutes} 分鐘`)
  }

  return data.link
}

function getUser(req) {
  return req.user;
}


module.exports = {
  getUser,
  imgurFileHandler
};