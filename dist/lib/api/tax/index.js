'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tax = exports.taxUrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------


var _errors = require('request-promise/errors');

var _errors2 = _interopRequireDefault(_errors);

var _request = require('../../request');

var _util = require('../util');

var _utils = require('../../../utils');

var _errors3 = require('../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ---------------------------------------------------------------------------
// Tax URLs -------------------------------------------------------------
// ---------------------------------------------------------------------------
var taxUrlFn = function taxUrlFn(accountName) {
    return (0, _util.baseUrl)(accountName) + '/taxes';
};
var taxUrl = exports.taxUrl = { create: function create(_ref) {
        var accountName = _ref.accountName;
        return taxUrlFn(accountName) + '.xml';
    }
};
// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------

var Tax = exports.Tax = function () {
    function Tax() {
        _classCallCheck(this, Tax);
    }

    _createClass(Tax, null, [{
        key: 'create',
        value: function create(auth, body) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.postSetup)(auth, taxUrl.create), { root: this.root, body: body })).get('tax').catch(_errors2.default.StatusCodeError, function (err) {
                switch (err.statusCode) {
                    case 401:
                        throw new _errors3.InvalidInvoiceXpressAPIKey((0, _utils.debug)(auth));
                    case 422:
                        if ((0, _request.getErrorString)(err.error) === 'Tax name already exists.') {
                            throw new _errors3.InvoiceXpressElementAlreadyExists('Create tax: ' + (0, _utils.debug)(body));
                        } else if ((0, _request.getErrorString)(err.error) === 'The tax name is invalid') {
                            throw new _errors3.InvoiceXpressInvalidName('Create tax: ' + (0, _utils.debug)(body));
                        } else {
                            throw new _errors3.InvoiceXpressUnexpectedError('Create tax: ' + (0, _utils.debug)(body));
                        }
                    default:
                        throw err;
                }
            });
        }
    }]);

    return Tax;
}();

Tax.root = 'tax';
//# sourceMappingURL=index.js.map
