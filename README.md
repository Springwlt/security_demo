###  服务器安全问题

一.CSRF
- CSRF（cross-site request forgery），跨站请求伪造，通过伪造用户数据请求发起攻击。

通过 referer、token 或者 验证码 来检测用户提交。
避免全站通用的cookie，严格设置cookie的域.
阻止第三方网站请求接口
对于用户修改删除等操作最好都使用post 操作。
尽量不要在页面的链接中暴露用户隐私信息。

```
const { Router } = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const csurf = require('csurf'); 
router.use(bodyParser.urlencoded({ extended: false }), csurf());

```

extended: false：表示使用系统模块querystring来处理，也是官方推荐的
extended: true：表示使用第三方模块qs来处理
从功能性来讲，qs比querystring要更强大，所以这里可以根据项目的实际需求来考虑


二. SQLi
- SQLi（SQL injection），SQL 注入，通过在数据库操作注入 SQL 片段发起攻击。SQLi 是非常危险的攻击，可以绕过系统中的各种限制直接对数据进行窃取和篡改。
  但同时， SQLi 又是比较容易防范的，只要对入参字符串做好转义处理就可以规避，常见的 ORM 模块都做好了此类处理。

- 防注入的一个比较简单的方式就是不要把生查询暴露在外部，可以使用orm的框架，或者自己定义一套查询映射规则

- 和防止SQL注入的方法一样呀不要相信任何用户的输入，包括cookie 转换，转义


- 从 cnodejs 的 mongodb 注入来看， nodejs 和 php 一样支持参数数组传参，即 req.query.id 获取到的值可以是个数组比如请求 index?id[$regex]=1 后端获取到的 id 值为{"$ne": 1}
  限制你请求的参数的值只能为字符串，就不可能注入。

- 现无法统一解决

- 接口要求
(1). 用户服务器。
      通过id查询，验证id的类型，id是否存在，id中是否包含特殊字符
      密码信息不记录的log中，或打印在控制台
      删除接口，修改接口，需要验证token,无法验证的数据，删除，修改之前记录log
(2). 项目服务器。
      按条件查询，需判断参数是否有查询添加，特殊场景特殊对待
      删除项目场景数据尽可能验证身份，无法验证删除，修改之前记录数据记录log
      类似此种方法，接口与编辑器讨论,无查询添加获全表数据是否合理
      ```
      function getProjectsByQuery(query)
      {
          var deferred = Q.defer();

          Project.find( query )
              .exec(function ( err, project ) {
                  if (err)
                  {
                      deferred.resolve(  err );
                  }
                  else
                  {
                      deferred.resolve( project );
                  }
              });

          return deferred.promise;
      }
      ```
      通过id查询，验证id的类型，id是否存在，id中是否包含特殊字符
      通过条件查询，sql后端组装，查询条件中不能有$in,$ne,$gte,等mongodb支持的原生语法

(3). 资源服务器。
      通过id查询，验证id的类型，id是否存在，id中是否包含特殊字符
      通过条件查询，sql后端组装，查询条件中不能有$in,$ne,$gte,等mongodb支持的原生语法
      删除项目场景数据尽可能验证身份，无法验证删除，修改之前记录数据记录log
(4). 发布服务器。
    ip白名单限制





三. DoS

- DoS（denial-of-service），拒绝服务攻击，通过大量的无效访问让应用陷入瘫痪。在DoS基础上又有 DDoS（distributed denial-of-service），分布式拒绝服务攻击，是加强版的 DoS。
  通常此类攻击在传输层就已经做好了过滤，应用层一般在集群入口也做了过滤，应用节点不需要再关心。

  应用层一般在机器入口做过滤。
 
 ```
  require('yup');
  escape-html,csurf, helmet 

```
  
  
四. xss
- XSS（cross-site scripting），跨站脚本攻击，通过在页面中注入脚本发起攻击。

```
Helmet插件可以解决xss等攻击
const express = require('express')
const helmet = require('helmet')
 
const app = express()
//使用helmet全部功能

app.use(helmet())
```








