'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getter = exports.publisher = undefined;
exports.getErrorString = getErrorString;

var _bluebirdRetry = require('bluebird-retry');

var _bluebirdRetry2 = _interopRequireDefault(_bluebirdRetry);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _errors = require('request-promise/errors');

var _errors2 = _interopRequireDefault(_errors);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _xml = require('../utils/xml');

var _utils = require('../utils');

var _errors3 = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ---------------------------------------------------------------------------
// Internal Functions --------------------------------------------------------
// ---------------------------------------------------------------------------
// https://invoicexpress.com/api/introduction/request-limits
// You can perform up to 100 requests per minute from the same IP address.
// If you exceed this limit, you’ll get a 429 Too Many Requests response for
// subsequent requests.
//
// We recommend you handle 429 responses so your integration retries
// requests automatically.
//
// ATTN: our experience is that they cannot even handle that, hence the times 2
var retry = function retry(prms) {
    return (0, _bluebirdRetry2.default)(prms, { interval: 2 * 60 * 1000 / 100,
        backoff: 2,
        max_interval: 1000,
        max_tries: 6,
        predicate: function predicate(err) {
            return err instanceof _errors2.default.StatusCodeError && err.statusCode === 429;
        },
        throw_original: true
    });
};
// ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------

var requestOptions = {
    headers: {
        'content-type': 'application/xml',
        charset: 'utf8',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) ' + 'AppleWebKit/537.36 (KHTML, like Gecko) ' + 'Chrome/46.0.2490.80 Safari/537.36',
        accept: '*/*'
    }
};
// ---------------------------------------------------------------------------
// External Functions --------------------------------------------------------
// ---------------------------------------------------------------------------
var publisher = exports.publisher = function publisher(_ref) {
    var method = _ref.method,
        apiKey = _ref.apiKey,
        body = _ref.body,
        url = _ref.url,
        root = _ref.root;
    return (0, _requestPromise2.default)(Object.assign({}, requestOptions, { method: method,
        url: url, qs: { api_key: apiKey }, body: body ? (0, _xml.toXml)(root, body) : '' })).catch(_errors2.default.StatusCodeError, function (res) {
        _winston2.default.error(method + '@' + url + '/' + root + ': [' + res.statusCode + '] ' + ('' + (0, _utils.debug)(res.error)), '\nXML:\n', (0, _xml.toXml)(root, body));
        if (res.statusCode !== 401) {
            return (0, _xml.fromXml)(res.error).then(function (decodedError) {
                // we need to recreate the error from scratch :(
                throw new _errors2.default.StatusCodeError(res.statusCode, decodedError, res.options, res.response);
            });
        } else {
            throw res;
        }
    }).then(function (result) {
        return (0, _xml.fromXml)(result);
    });
};
var getter = exports.getter = function getter(_ref2) {
    var apiKey = _ref2.apiKey,
        url = _ref2.url;
    return _requestPromise2.default.get(Object.assign({}, requestOptions, { url: url, qs: { api_key: apiKey } })).catch(_errors2.default.StatusCodeError, function (res) {
        _winston2.default.error('GET@' + url + ' : [' + res.statusCode + '] ' + ('' + (0, _utils.debug)(res.error)));
        if (res.statusCode === 404) {
            throw new _errors3.InvoiceXpressInvalidId('' + url);
        } else {
            throw res;
        }
    }).then(function (result) {
        return (0, _xml.fromXml)(result);
    });
};
function getErrorString(errr) {
    //        InvX  Invx
    return errr.errors.error;
}
//# sourceMappingURL=request.js.map
