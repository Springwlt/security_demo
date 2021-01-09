const { mongoStream, mongoClient, mongoose, moment } = require('../utils/common');
const logger = new mongoose.Schema({
  name: {
    type: String
  }, // 日志来源应用
  level: {
    type: Number
  }, // 日志等级 fatal(60)  error(50)  warn(40)  info(30)  debug(20)  trace(10)
  remoteAddr: {
    type: String,
    default: ""
  },//地址
  method: {
    type: String,
    default: ""
  },//请求方式
  url: {
    type: String,
    default: ""
  },//请求方式
  httpVersion: {
    type: String,
    default: ""
  }, // 协议
  status: {
    type: String,
    default: ""
  }, //响应http码
  responseTime: {
    type: String,
    default: ""
  }, //响应时间
  params: {
    type: Object,
    default: {}
  }, //get参数
  body: {
    type: Object,
    default: {}
  }, //get参数
  created: {
    type: String,
    default: moment().format("YYYY-MM-DD HH:mm:ss")
  },
}, {
  safe: true,
  versionKey: false
});

logger.set('toObject', { getters: true })
const LoggerEntity = mongoClient.model('logger', logger, 'logger');
module.exports = mongoStream({ model: LoggerEntity });