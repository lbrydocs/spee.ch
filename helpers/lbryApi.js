const axios = require('axios');
const logger = require('winston');
const config = require('../config/speechConfig.js');
const { apiHost, apiPort } = config.api;
const lbryApiUri = 'http://' + apiHost + ':' + apiPort;

function handleLbrynetResponse ({ data }, resolve, reject) {
  logger.debug('lbry api data:', data);
  if (data.result) {
    // check for an error
    if (data.result.error) {
      logger.debug('Lbrynet api error:', data.result.error);
      reject(data.result.error);
      return;
    };
    resolve(data.result);
    return;
  }
  // fallback in case the just timed out
  reject(JSON.stringify(data));
}

module.exports = {
  publishClaim (publishParams) {
    logger.debug(`lbryApi >> Publishing claim to "${publishParams.name}"`);
    return new Promise((resolve, reject) => {
      axios
        .post(lbryApiUri, {
          method: 'publish',
          params: publishParams,
        })
        .then(response => {
          handleLbrynetResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getClaim (uri) {
    logger.debug(`lbryApi >> Getting Claim for "${uri}"`);
    return new Promise((resolve, reject) => {
      axios
        .post(lbryApiUri, {
          method: 'get',
          params: { uri, timeout: 20 },
        })
        .then(response => {
          handleLbrynetResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getClaimList (claimName) {
    logger.debug(`lbryApi >> Getting claim_list for "${claimName}"`);
    return new Promise((resolve, reject) => {
      axios
        .post(lbryApiUri, {
          method: 'claim_list',
          params: { name: claimName },
        })
        .then(response => {
          handleLbrynetResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  resolveUri (uri) {
    logger.debug(`lbryApi >> Resolving URI for "${uri}"`);
    // console.log('resolving uri', uri);
    return new Promise((resolve, reject) => {
      axios
        .post(lbryApiUri, {
          method: 'resolve',
          params: { uri },
        })
        .then(({ data }) => {
          if (data.result[uri].error) {  // check for errors
            reject(data.result[uri].error);
          } else {  // if no errors, resolve
            resolve(data.result[uri]);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getDownloadDirectory () {
    logger.debug('lbryApi >> Retrieving the download directory path from lbry daemon...');
    return new Promise((resolve, reject) => {
      axios
        .post(lbryApiUri, {
          method: 'settings_get',
        })
        .then(({ data }) => {
          if (data.result) {
            resolve(data.result.download_directory);
          } else {
            return new Error('Successfully connected to lbry daemon, but unable to retrieve the download directory.');
          }
        })
        .catch(error => {
          logger.error('Lbrynet Error:', error);
          resolve('/home/lbry/Downloads/');
        });
    });
  },
  createChannel (name) {
    return new Promise((resolve, reject) => {
      axios
        .post(lbryApiUri, {
          method: 'channel_new',
          params: {
            channel_name: name,
            amount      : 0.1,
          },
        })
        .then(response => {
          logger.verbose('createChannel response:', response);
          handleLbrynetResponse(response, resolve, reject);
        })
        .catch(error => {
          logger.error('createChannel error:', error);
          reject(error);
        });
    });
  },
};
