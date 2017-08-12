'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InvoiceReceipt = exports.invoiceReceiptUrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------

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
// Invoice URLs --------------------------------------------------------------
// ---------------------------------------------------------------------------
var invoiceReceiptUrlFn = function invoiceReceiptUrlFn(accountName) {
    return (0, _util.baseUrl)(accountName) + '/invoice_receipts';
};
var generatePdfUrlFn = function generatePdfUrlFn(accountName) {
    return (0, _util.baseUrl)(accountName) + '/api/pdf';
};
var invoiceReceiptUrl = exports.invoiceReceiptUrl = { create: function create(_ref) {
        var accountName = _ref.accountName;
        return invoiceReceiptUrlFn(accountName) + '.xml';
    },
    get: function get(_ref2) {
        var accountName = _ref2.accountName,
            invoiceId = _ref2.invoiceId;
        return invoiceReceiptUrlFn(accountName) + '/' + invoiceId + '.xml';
    },
    update: function update(_ref3) {
        var accountName = _ref3.accountName,
            invoiceId = _ref3.invoiceId;
        return invoiceReceiptUrlFn(accountName) + '/' + invoiceId + '.xml';
    },
    listAll: function listAll(_ref4) {
        var accountName = _ref4.accountName;
        return invoiceReceiptUrlFn(accountName) + '.xml';
    },
    changeStatus: function changeStatus(_ref5) {
        var accountName = _ref5.accountName,
            invoiceId = _ref5.invoiceId;
        return invoiceReceiptUrlFn(accountName) + '/' + invoiceId + '/change-state.xml';
    },
    generatePdf: function generatePdf(_ref6) {
        var accountName = _ref6.accountName,
            invoiceId = _ref6.invoiceId;
        return generatePdfUrlFn(accountName) + '/' + invoiceId + '.xml';
    }
};
// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------

var InvoiceReceipt = exports.InvoiceReceipt = function () {
    function InvoiceReceipt() {
        _classCallCheck(this, InvoiceReceipt);
    }

    _createClass(InvoiceReceipt, null, [{
        key: 'create',
        value: function create(auth, body) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.postSetup)(auth, invoiceReceiptUrl.create), { root: this.root, body: body })).catch(_errors2.default.StatusCodeError, function (err) {
                switch (err.statusCode) {
                    case 401:
                        throw new _errors3.InvalidInvoiceXpressAPIKey((0, _utils.debug)(auth));
                    // TODO: still more errors to check
                    case 422:
                        if ((0, _request.getErrorString)(err.error) === 'Items element should be of type array') {
                            throw new _errors3.InvoiceXpressNotArray('Create invoice_receipt items: ' + (0, _utils.debug)(body));
                        } else if ((0, _request.getErrorString)(err.error).startsWith('Country')) {
                            throw new _errors3.InvoiceXpressUnkownCountry('Create invoice_receipt country: ' + (0, _utils.debug)(body));
                        } else if ((0, _request.getErrorString)(err.error) === 'Client is invalid') {
                            throw new _errors3.InvoiceXpressInvalidClient('Create invoice_receipt country: ' + (0, _utils.debug)(body));
                        } else {
                            throw new _errors3.InvoiceXpressUnexpectedError('Create invoice_receipt: ' + err.error + ' ' + (0, _utils.debug)(body));
                        }
                    default:
                        throw err;
                }
            });
        }
    }, {
        key: 'get',
        value: function get(auth, invoiceId) {
            return (0, _request.getter)((0, _util.getSetup)(auth, invoiceReceiptUrl.get, { invoiceId: invoiceId })).get(this.root);
        }
        // warning: this deletes non updated items

    }, {
        key: 'update',
        value: function update(auth, body, invoiceId) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.putSetup)(auth, invoiceReceiptUrl.update, { invoiceId: invoiceId }), { root: this.root, body: body }));
        }
    }, {
        key: 'listAll',
        value: function listAll(auth, query) {
            return (0, _request.getter)((0, _util.listSetup)(auth, invoiceReceiptUrl.listAll, query)).get('invoice_receipts').get('invoice_receipt').then(function (data) {
                return (0, _util.toArray)(data);
            });
        }
    }, {
        key: 'changeState',
        value: function changeState(auth, body, invoiceId) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.putSetup)(auth, invoiceReceiptUrl.changeStatus, { invoiceId: invoiceId }), { root: this.root, body: body }));
        }
    }, {
        key: 'generatePDF',
        value: function generatePDF(auth, invoiceId) {
            return (0, _request.getter)((0, _util.getSetup)(auth, invoiceReceiptUrl.generatePdf, { invoiceId: invoiceId })).get('output');
        }
    }]);

    return InvoiceReceipt;
}();

InvoiceReceipt.root = 'invoice_receipt';
//# sourceMappingURL=index.js.map
