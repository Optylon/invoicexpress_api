'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.User = exports.userUrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------


exports.debug = debug;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _request = require('../../request');

var _util3 = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ---------------------------------------------------------------------------
// User URLs -----------------------------------------------------------------
// ---------------------------------------------------------------------------
var userUrl = exports.userUrl = { login: function login() {
        return (0, _util3.baseUrl)('www') + '/login.xml';
    },
    accounts: function accounts() {
        return (0, _util3.baseUrl)('www') + '/users/accounts.xml';
    },
    changeAccount: function changeAccount(_ref) {
        var accountName = _ref.accountName;
        return (0, _util3.baseUrl)(accountName) + '/users/change_account.xml';
    }
};
function debug(x) {
    return _util2.default.inspect(x, { depth: null, colors: true });
}
// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------

var User = exports.User = function () {
    function User() {
        _classCallCheck(this, User);
    }

    _createClass(User, null, [{
        key: 'login',
        value: function login(body) {
            return (0, _request.publisher)(Object.assign({}, (0, _util3.unAuthPostSetup)(userUrl.login), { root: 'credentials', body: body })).get('accounts').get('account').then(function (data) {
                return (0, _util3.toArray)(data);
            });
            // AccountLoginInformation[]
        }
    }, {
        key: 'accounts',
        value: function accounts(auth) {
            return (0, _request.getter)((0, _util3.getSetup)(auth, userUrl.accounts, {})).get('accounts').get('account').then(function (data) {
                return (0, _util3.toArray)(data);
            });
            // AccountLoginInformation[]
        }
    }, {
        key: 'changeAccount',
        value: function changeAccount(auth, id) {
            return (0, _request.publisher)(Object.assign({}, (0, _util3.putSetup)(auth, userUrl.changeAccount, { id: id }), { root: 'change_account_to' }));
        }
    }]);

    return User;
}();
//# sourceMappingURL=index.js.map
