'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isDevEnv = exports.isProdEnv = exports.debug = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = exports.debug = function debug(val) {
    if (val instanceof Object) {
        return _util2.default.inspect(_ramda2.default.omit(['client', 'connection', 'socket', 'request', 'ReadableState', 'req'], val), { depth: null, colors: true });
    } else {
        return _util2.default.inspect(val, { depth: null, colors: true });
    }
};
var isProdEnv = exports.isProdEnv = process.env.NODE_ENV === 'production';
var isDevEnv = exports.isDevEnv = process.env.NODE_ENV !== 'production';
//# sourceMappingURL=index.js.map
