const { ImgurClient } = require('imgur')

const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })

module.exports = async (file) => {
  const { data } = await client.upload(file)
  return data.link
}
