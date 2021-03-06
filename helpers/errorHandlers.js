const logger = require('winston');

module.exports = {
  returnErrorMessageAndStatus: function (error) {
    let status, message;
    // check for daemon being turned off
    if (error.code === 'ECONNREFUSED') {
      status = 503;
      message = 'Connection refused.  The daemon may not be running.';
    // check for errors from the daemon
    } else if (error.response) {
      status = error.response.status || 500;
      if (error.response.data) {
        if (error.response.data.message) {
          message = error.response.data.message;
        } else if (error.response.data.error) {
          message = error.response.data.error.message;
        } else {
          message = error.response.data;
        }
      } else {
        message = error.response;
      }
    // check for thrown errors
    } else if (error.message) {
      status = 400;
      message = error.message;
    // fallback for everything else
    } else {
      status = 400;
      message = error;
    }
    return [status, message];
  },
  handleRequestError: function (originalUrl, ip, error, res) {
    logger.error(`Request Error on ${originalUrl}`, module.exports.useObjectPropertiesIfNoKeys(error));
    const [status, message] = module.exports.returnErrorMessageAndStatus(error);
    res
      .status(status)
      .render('requestError', module.exports.createErrorResponsePayload(status, message));
  },
  handleApiError: function (originalUrl, ip, error, res) {
    logger.error(`Api Error on ${originalUrl}`, module.exports.useObjectPropertiesIfNoKeys(error));
    const [status, message] = module.exports.returnErrorMessageAndStatus(error);
    res
      .status(status)
      .json(module.exports.createErrorResponsePayload(status, message));
  },
  useObjectPropertiesIfNoKeys: function (err) {
    if (Object.keys(err).length === 0) {
      let newErrorObject = {};
      Object.getOwnPropertyNames(err).forEach((key) => {
        newErrorObject[key] = err[key];
      });
      return newErrorObject;
    }
    return err;
  },
  createErrorResponsePayload (status, message) {
    return {
      status,
      success: false,
      message,
    };
  },
};
