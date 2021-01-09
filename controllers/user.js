const UserService = require('../services/UserService');
const userService = new UserService();

class User {
  async getUserList(req, res, next) {
    try {
      userService.getUserList().then((data) => {
        res.json({
          code: 0,
          msg: 'OK',
          data: data
        })
      }).catch((e)=>{
        res.json({
          code: -1,
          msg: 'error'
        })
      })
    } catch (error) {
      console.log('create error--> ', error);
      return error;
    }
  }
  
}

module.exports = User;