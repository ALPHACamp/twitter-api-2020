
/**
 * 
 * @param {object} req 
 * @returns {object} user
 */

function getUser(req) {
  return req.user
}


module.exports = {
  getUser
};