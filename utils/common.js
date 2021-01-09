const config = require('../config');
exports.config = config;

const nodemailer = require('nodemailer');
exports.nodemailer = nodemailer;

const mongoStream = require('bunyan-mongodb-stream');
exports.mongoStream = mongoStream;

const promise = require('bluebird')
exports.promise = promise;

const mongoose = require('mongoose');
mongoose.Promise = promise;     // 使用bluebird代替原生promise
exports.mongoose = mongoose;

const fs = require('fs');
exports.fs = fs;

const path = require('path');
exports.path = path;

const moment = require('moment');
exports.moment = moment;

const q = require("q");
exports.Q = q;

const multer = require("multer");
exports.multer = multer;

const crypto = require("crypto");
exports.crypto = crypto;

const urllib = require("urllib");
exports.urllib = urllib;

const url = require("url");
exports.url = url;

const bcrypt = require('bcrypt-nodejs');
exports.bcrypt = bcrypt;

const morgan = require('morgan');
exports.morgan = morgan;

const onFinished = require('on-finished');
exports.onFinished = onFinished;

const _ = require("lodash");
exports._ = _;

const bunyan = require('bunyan');
exports.bunyan = bunyan;

const UUID = require('uuid');
exports.UUID = UUID;

//user model原型链上的方法
const User = require('../models/user.model');
exports.User = User;

const compare = function (password, dbPassword) {
  let deferred = q.defer();
  bcrypt.compare(password, dbPassword, function (err, isMatch) {
    if (err) {
      deferred.reject({ code: -1, msg: err });
    }
    deferred.resolve({ code: 1, data: isMatch });
  });
  return deferred.promise;
};

exports.compare = compare;

//正则表达式对字符串进行验证
const validation = {
  isEmailAddress: function (str) {
    let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(str);  // returns a boolean
  },
  isNotEmpty: function (str) {
    let pattern = /\S+/;
    return pattern.test(str);  // returns a boolean
  },
  isNumber: function (str) {
    let pattern = /^\d+$/;
    return pattern.test(str);  // returns a boolean
  },
  isSame: function (str1, str2) {
    return str1 === str2;
  },
  stripscript: function (str) { // returns a boolean
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    return pattern.test(str);
  }

};

exports.validation = validation;


const mongodbConfig = config.mongodb;
/**
 * 配置 mongoDB options
 */
function getMongoOptions() {
  let options = {
    poolSize: 5,  //连接池中维护的连接数
    reconnectTries: Number.MAX_VALUE,
    keepAlive: 120,
  };
  if (mongodbConfig.user) options.user = mongodbConfig.user;
  if (mongodbConfig.pwd) options.pwd = mongodbConfig.pwd;
  if (mongodbConfig.replicaSet.name) options.replicaSet = mongodbConfig.replicaSet.name;
  return options;
}

/**
 * 拼接字符串
 */
function getMongoUrl() {
  let mongoUrl = 'mongodb://';
  let dbName = mongodbConfig.db;
  let replicaSet = mongodbConfig.replicaSet;
  if (replicaSet.name) { // 如果配置了 replicaSet 的名字 则使用 replicaSet
    let members = replicaSet.members;
    for (let member of members) {
      mongoUrl += `${member.host}:${member.port},`;
    }
    mongoUrl = mongoUrl.slice(0, -1); // 去掉末尾逗号
  } else {
    mongoUrl += `${mongodbConfig.host}:${mongodbConfig.port}`;
  }
  mongoUrl += `/${dbName}`;

  return mongoUrl;
}

let mongoClient = mongoose.createConnection(getMongoUrl(), { useNewUrlParser: true }, (err, res) => {
  if (err) {
    console.log(err)
  }
}, getMongoOptions());

/**
 * Mongo 连接成功回调
 */
mongoClient.on('connected', function () {
  console.log('Mongoose connected to ' + getMongoUrl());
});
/**
 * Mongo 连接失败回调
 */
mongoClient.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});
/**
 * Mongo 关闭连接回调
 */
mongoClient.on('disconnected', function () {
  console.log('Mongoose disconnected');
});


/**
 * 关闭 Mongo 连接
 */

const close = function () {
  mongoClient.close();
};

exports.close = close;
exports.mongoClient = mongoClient;


let streams = [];
const { logger: loggerModel } = require('../models/index');
if (config.logconfig.fileStorage) {
  if (config.logconfig.level.includes("info")) {
    streams.push(
      {
        type: 'rotating-file',
        level: 'info',
        path: path.join(path.resolve(__dirname, '..'), '/logs/examples_app.log'),
        period: '1d',  // 每天记录一次日志
        count: config.logconfig.count //10备份，即保留10天的日志
      }
    )
  }
  if (config.logconfig.level.includes("debug")) {
    streams.push(
      {
        type: 'rotating-file',
        level: 'debug',
        path: path.join(path.resolve(__dirname, '..'), 'logs/examples_debug.log'),
        period: '1d',
        count: config.logconfig.count
      }
    )
  }
  if (config.logconfig.level.includes("warn")) {
    streams.push(
      {
        type: 'rotating-file',
        level: 'warn',
        path: path.join(path.resolve(__dirname, '..'), 'logs/examples_warn.log'),
        period: '1d',
        count: config.logconfig.count
      }
    )
  }
  if (config.logconfig.level.includes("error")) {
    streams.push(
      {
        type: 'rotating-file',
        level: 'error',
        path: path.join(path.resolve(__dirname, '..'), 'logs/examples_error.log'),
        period: '1d',
        count: config.logconfig.count
      }
    )
  }
  streams.push(
    {
      stream: process.stderr,
      level: 'warn'
    }
  );
}
if (config.logconfig.dbStorage) {
  streams.push(
    {
      stream: loggerModel
    }
  );
};
exports.streams = streams;

const logger = require('./logger');
exports.logger = logger;


