const imgur = require("imgur");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
imgur.setClientId(IMGUR_CLIENT_ID);

const imgurFileHandler = (image) => {
  return new Promise((resolve, reject) => {
    if (!image) return resolve(null);
    return imgur
      .uploadFile(image.path)
      .then((img) => resolve(img?.link || null))
      .catch((error) => reject(error));
  });
};

module.exports = imgurFileHandler;
