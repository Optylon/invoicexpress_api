'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toArray = exports.listSetup = exports.getSetup = exports.putSetup = exports.postSetup = exports.unAuthPostSetup = exports.baseUrl = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _humps = require('humps');

var _humps2 = _interopRequireDefault(_humps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ---------------------------------------------------------------------------
// Internal API url functions ------------------------------------------------
// ---------------------------------------------------------------------------
var baseUrl = exports.baseUrl = function baseUrl(accountName) {
    return 'https://' + accountName + '.app.invoicexpress.com';
};
var unAuthPostSetup = exports.unAuthPostSetup = function unAuthPostSetup(urlFn) {
    return { method: 'POST',
        url: urlFn()
    };
};
var postSetup = exports.postSetup = function postSetup(auth, urlFn) {
    var accountName = auth.accountName,
        apiKey = auth.apiKey;

    return { method: 'POST',
        apiKey: apiKey,
        url: urlFn({ accountName: accountName })
    };
};
var putSetup = exports.putSetup = function putSetup(auth, urlFn, data) {
    var accountName = auth.accountName,
        apiKey = auth.apiKey;

    return { method: 'PUT',
        apiKey: apiKey,
        url: urlFn(Object.assign({ accountName: accountName }, data))
    };
};
var getSetup = exports.getSetup = function getSetup(auth, urlFn) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accountName = auth.accountName,
        apiKey = auth.apiKey;

    return { apiKey: apiKey,
        url: urlFn(Object.assign({ accountName: accountName }, data))
    };
};
var listSetup = exports.listSetup = function listSetup(auth, urlFn, params) {
    var accountName = auth.accountName,
        apiKey = auth.apiKey;

    var formattedParams = Object.entries(_humps2.default.decamelizeKeys(params)).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return key + '=' + value;
    }).join('&');
    return { apiKey: apiKey,
        url: urlFn({ accountName: accountName }) + '?' + formattedParams
    };
};
// ---------------------------------------------------------------------------
// Internal API utility functions --------------------------------------------
// ---------------------------------------------------------------------------
/** Assure all array returning functions really return arrays
 *  and not single object when array.length === 1
 */
var toArray = exports.toArray = function toArray(arrayOrElement) {
    return Array.isArray(arrayOrElement) ? arrayOrElement : [arrayOrElement];
};
//# sourceMappingURL=util.js.map
