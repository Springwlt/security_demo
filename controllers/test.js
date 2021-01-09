const UserService = require('../services/UserService');
const userService = new UserService();

class User extends Controller {
  constructor() {
    super()
  }

  async getUserList(req, res, next) {
    let entity = new this.Model(obj);
    try {
      userService.getUserList().then((data)=>{
        res.json({
          code:0,
          msg:'OK',
          data:data
        })
      });
    } catch (error) {
      console.log('create error--> ', error);
      return error;
    }
  }
}

module.exports = function () {
  return new User()
};