const BaseDao = require('./BaseDao');
// 导入对应的实体
const User = require('../models/user.model');
const common = require('../utils/common');

class UserDao extends BaseDao {
  constructor() {
    super(User);
  }
  //如果有啥特殊需求的话，自己再重写方法咯
  async create(obj) {
    let entity = new this.Model(obj);
    try {
      let dao = await this.Model.create(entity);
      console.log('create result--> ', dao);
      return dao;
    } catch (error) {
      console.log('create error--> ', error);
      return error;
    }
  }

  async login(userParam) {
    {
      var deferred = common.Q.defer();
      let user = await this.Model.findOne(entity);
      this.Model.findOne({ email: userParam.email }, function (err, user) {
        if (err || !user) {
          if (!user)
            deferred.reject("用户不存在");
          else
            deferred.reject(err);
        }
        else {
          user.checkPassword(userParam.password, function (err, isMatch) {
            if (err) {
              deferred.reject(err);
            }
            else {
              if (isMatch) {
                deferred.resolve(user);
              } else {
                deferred.reject("密码错误");
              }
            }
          });
        }
      });
      return deferred.promise;
    }
  }
}

module.exports = UserDao;