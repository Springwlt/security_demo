const UserDao = require('../dao/UserDao');
const ObjectId = require('mongoose').Types.ObjectId;
const { logger } = require('../utils/common');

let userDao = new UserDao();

class UserService {
  async getUserList() {
    try {
      logger.info("调用 dao 层查询数据");
      let [error, userList] = await userDao.findAl().then(userList => [null, userList]).catch(error => [error, null]);
      if(error){
        logger.warn("调用 dao 层查询数据");
      }else{
        return userList;
      }
    } catch (err) {
      logger.error(`getUserList error--> ${err}`);
      return err;
    }
  }
}
module.exports = UserService;