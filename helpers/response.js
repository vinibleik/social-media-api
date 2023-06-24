/**
 * Default API Response Object
 * @typedef {Object} APIResponse
 * @property {Boolean} status - Response status. true if success false otherwise.
 * @property {Object | undefined} data - Response data if status is true.
 * @property {String | String[] | undefined} errors - Errors messages if status is false.
 */

/**
 * Successful Response
 * @param {Object} data - Data for response
 * @returns {APIResponse} Successful Response Object
 */
function success(data) {
  return /** @type {APIResponse} */ ({
    status: true,
    data: data,
  });
}

/**
 * Failure Response
 * @param {String | String[]} errors - Errors messages
 * @returns {APIResponse} Failure Response Object
 */
function failure(errors) {
  return /** @type {APIResponse} */ ({
    status: false,
    errors: errors,
  });
}

module.exports = {
  success,
  failure,
};
