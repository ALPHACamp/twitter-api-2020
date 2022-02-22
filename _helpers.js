
/**
 * 
 * @param {object} req 
 * @returns {object} user
 */

function getUser(req) {
  return req.user
}

function we(){
  
}

/**
 * 
 * @param {object} req 
 * @returns {number} id
 */

function getUserId(req) {
  return getUser(req).id
}

module.exports = {
  getUser,
};