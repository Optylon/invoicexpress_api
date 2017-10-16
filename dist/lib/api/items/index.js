'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Items = exports.itemsUrl = exports.DefaultTaxEnum = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------


var _request = require('../../request');

var _util = require('../util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DefaultTaxEnum = exports.DefaultTaxEnum = undefined;
(function (DefaultTaxEnum) {
    DefaultTaxEnum[DefaultTaxEnum["NonDefaultTax"] = 0] = "NonDefaultTax";
    DefaultTaxEnum[DefaultTaxEnum["DefaultTax"] = 1] = "DefaultTax";
})(DefaultTaxEnum || (exports.DefaultTaxEnum = DefaultTaxEnum = {}));
// ---------------------------------------------------------------------------
// Invoice URLs --------------------------------------------------------------
// ---------------------------------------------------------------------------
var itemsUrlFn = function itemsUrlFn(accountName) {
    return (0, _util.baseUrl)(accountName) + '/items';
};
var itemsUrl = exports.itemsUrl = { create: function create(_ref) {
        var accountName = _ref.accountName;
        return itemsUrlFn(accountName) + '.xml';
    },
    get: function get(_ref2) {
        var accountName = _ref2.accountName,
            itemId = _ref2.itemId;
        return itemsUrlFn(accountName) + '/' + itemId + '.xml';
    }
    // TODO: missing delete

    , update: function update(_ref3) {
        var accountName = _ref3.accountName,
            itemId = _ref3.itemId;
        return itemsUrlFn(accountName) + '/' + itemId + '.xml';
    },
    listAll: function listAll(_ref4) {
        var accountName = _ref4.accountName;
        return itemsUrlFn(accountName) + '.xml';
    }
};
// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------

var Items = exports.Items = function () {
    function Items() {
        _classCallCheck(this, Items);
    }

    _createClass(Items, null, [{
        key: 'create',
        value: function create(auth, body) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.postSetup)(auth, itemsUrl.create), { root: this.root, body: body }));
        }
    }, {
        key: 'get',
        value: function get(auth, itemId) {
            return (0, _request.getter)((0, _util.getSetup)(auth, itemsUrl.get, { itemId: itemId })).get(this.root);
        }
        // warning: this deletes non updated items

    }, {
        key: 'update',
        value: function update(auth, body, itemId) {
            return (0, _request.publisher)(Object.assign({}, (0, _util.putSetup)(auth, itemsUrl.update, { itemId: itemId }), { root: this.root, body: body }));
        }
    }, {
        key: 'listAll',
        value: function listAll(auth, query) {
            return (0, _request.getter)((0, _util.listSetup)(auth, itemsUrl.listAll, query)).get('items').then(function (dt) {
                return dt === null ? [] : dt['item'];
            }).then(function (data) {
                return (0, _util.toArray)(data);
            });
        }
    }]);

    return Items;
}();

Items.root = 'item';
//# sourceMappingURL=index.js.map
