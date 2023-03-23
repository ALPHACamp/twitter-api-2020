const APIController = {
  getTestJSON: (req, res, next) => {
    res.json({ 
      status: 'success',
      data: {
        id: 1,
        name: 'user1',
        email: 'user1@example.com',
        account: 'user1',
        introduction: 'I am Iron Man!'
      }
    })
  }
}

module.exports = APIController