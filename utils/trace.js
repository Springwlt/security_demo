const { morgan, onFinished, UUID, logger } = require('../utils/common');
const { logging } = logger;
const { v4: uuid } = UUID;

module.exports = function traceMiddleware() {
  return [
    morgan('common', { skip: () => true }), (req, res, next) => {
      req.uuid = uuid();
      req.logger = logger.child({ uuid: req.uuid });
      req.loggerSql = req.logger.child({ type: 'sql' });
      req.logging = logging(req.loggerSql, 'info');
      onFinished(res, () => {
        let remoteAddr = morgan['remote-addr'](req, res);
        let method = morgan['method'](req, res);
        let url = morgan['url'](req, res);
        let httpVersion = morgan['http-version'](req, res);
        let status = morgan['status'](req, res);
        let responseTime = morgan['response-time'](req, res);
        let params = req.query;
        let body = req.body;
        console.log("======================");
        req.logger.info({ type: 'res', remoteAddr, method, url, httpVersion, status, responseTime, params, body });
      });
      next();
    },
  ];
};
