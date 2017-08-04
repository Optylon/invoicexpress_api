'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Account = exports.accountUrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------


var _request = require('../../request');

var _util = require('../util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ---------------------------------------------------------------------------
// Account URLs --------------------------------------------------------------
// ---------------------------------------------------------------------------
var accountUrlFn = function accountUrlFn(accountName) {
    return (0, _util.baseUrl)(accountName) + '/api/accounts';
};
var accountUrl = exports.accountUrl = {
    create: function create() {
        return (0, _util.baseUrl)('www') + '/api/accounts/create.xml';
    },
    get: function get(_ref) {
        var accountName = _ref.accountName,
            accountId = _ref.accountId;
        return accountUrlFn(accountName) + '/' + accountId + '/get.xml';
    },
    suspend: function suspend(_ref2) {
        var accountName = _ref2.accountName,
            accountId = _ref2.accountId;
        return accountUrlFn(accountName) + '/' + accountId + '/suspend.xml';
    },
    activate: function activate(_ref3) {
        var accountName = _ref3.accountName,
            accountId = _ref3.accountId;
        return accountUrlFn(accountName) + '/' + accountId + '/activate.xml';
    },
    update: function update(_ref4) {
        var accountName = _ref4.accountName,
            accountId = _ref4.accountId;
        return accountUrlFn(accountName) + '/' + accountId + '/update.xml';
    }
};
// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------

var Account = exports.Account = function () {
    function Account() {
        _classCallCheck(this, Account);
    }

    _createClass(Account, null, [{
        key: 'create',
        value: function create(body) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.unAuthPostSetup)(accountUrl.create), { root: this.root, body: body }));
        }
    }, {
        key: 'get',
        value: function get(auth, accountId) {
            return (0, _request.getter)((0, _util.getSetup)(auth, accountUrl.get, { accountId: accountId })).get(this.root).then(function (accountData) {
                return 'fiscalId' in accountData && accountData.fiscalId ? Object.assign({}, accountData, { fiscalId: accountData.fiscalId.toString() }) : accountData;
            });
        }
    }, {
        key: 'suspend',
        value: function suspend(auth, accountId) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.putSetup)(auth, accountUrl.suspend, { accountId: accountId })));
        }
    }, {
        key: 'activate',
        value: function activate(auth, accountId) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.putSetup)(auth, accountUrl.activate, { accountId: accountId })));
        }
    }, {
        key: 'update',
        value: function update(auth, accountId, body) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.putSetup)(auth, accountUrl.update, { accountId: accountId }), { root: this.root, body: body }));
        }
    }]);

    return Account;
}();

Account.root = 'account';
//# sourceMappingURL=index.js.map
