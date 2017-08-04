'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Sequence = exports.sequenceUrl = undefined;

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
// Sequence URLs -------------------------------------------------------------
// ---------------------------------------------------------------------------
var sequenceUrlFn = function sequenceUrlFn(accountName) {
    return (0, _util.baseUrl)(accountName) + '/sequences';
};
var sequenceUrl = exports.sequenceUrl = { create: function create(_ref) {
        var accountName = _ref.accountName;
        return sequenceUrlFn(accountName) + '.xml';
    },
    get: function get(_ref2) {
        var accountName = _ref2.accountName,
            sequenceId = _ref2.sequenceId;
        return sequenceUrlFn(accountName) + '/' + sequenceId + '.xml';
    },
    update: function update(_ref3) {
        var accountName = _ref3.accountName,
            sequenceId = _ref3.sequenceId;
        return sequenceUrlFn(accountName) + '/' + sequenceId + '/set_current.xml';
    },
    listAll: function listAll(_ref4) {
        var accountName = _ref4.accountName;
        return sequenceUrlFn(accountName) + '.xml';
    }
};
// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------

var Sequence = exports.Sequence = function () {
    function Sequence() {
        _classCallCheck(this, Sequence);
    }

    _createClass(Sequence, null, [{
        key: 'create',
        value: function create(auth, body) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.postSetup)(auth, sequenceUrl.create), { root: this.root, body: body })).get('sequence').catch(_errors2.default.StatusCodeError, function (err) {
                switch (err.statusCode) {
                    case 401:
                        throw new _errors3.InvalidInvoiceXpressAPIKey((0, _utils.debug)(auth));
                    case 422:
                        if ((0, _request.getErrorString)(err.error) === 'Sequence name already exists.') {
                            throw new _errors3.InvoiceXpressElementAlreadyExists('Create sequence: ' + (0, _utils.debug)(body));
                        } else if ((0, _request.getErrorString)(err.error) === 'The sequence name is invalid') {
                            throw new _errors3.InvoiceXpressInvalidName('Create sequence: ' + (0, _utils.debug)(body));
                        } else {
                            throw new _errors3.InvoiceXpressUnexpectedError('Create sequence: ' + (0, _utils.debug)(body));
                        }
                    default:
                        throw err;
                }
            });
        }
    }, {
        key: 'get',
        value: function get(auth, sequenceId) {
            return (0, _request.getter)((0, _util.getSetup)(auth, sequenceUrl.get, { sequenceId: sequenceId })).get('sequence').catch(_errors2.default.StatusCodeError, function (err) {
                switch (err.statusCode) {
                    case 401:
                        throw new _errors3.InvalidInvoiceXpressAPIKey((0, _utils.debug)(auth));
                    case 404:
                        if ((0, _request.getErrorString)(err.error) === 'No sequence matches') {
                            throw new _errors3.InvoiceXpressElementAlreadyExists('Get sequence: ' + sequenceId);
                        }
                    default:
                        throw err;
                }
            });
        }
    }, {
        key: 'update',
        value: function update(auth, sequenceId) {
            return (0, _request.publisher)((0, _util.putSetup)(auth, sequenceUrl.update, { sequenceId: sequenceId }));
        }
    }, {
        key: 'listAll',
        value: function listAll(auth) {
            return (0, _request.getter)((0, _util.getSetup)(auth, sequenceUrl.listAll)).get('sequences').get('sequence');
        }
    }]);

    return Sequence;
}();

Sequence.root = 'sequence';
//# sourceMappingURL=index.js.map
