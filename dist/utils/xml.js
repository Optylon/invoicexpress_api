'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toXml = exports.fromXml = exports.writeFile = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
// for debugging purposes only


var _js2xmlparser = require('js2xmlparser');

var _js2xmlparser2 = _interopRequireDefault(_js2xmlparser);

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _processors = require('xml2js/lib/processors');

var _humps = require('humps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ---------------------------------------------------------------------------
// Constants -----------------------------------------------------------------
// ---------------------------------------------------------------------------
/** moment.js parse mode */
var strictParsing = true;
// ---------------------------------------------------------------------------
// Debuging features ---------------------------------------------------------
// ---------------------------------------------------------------------------
var xmlPath = _fs2.default.existsSync(process.env['XML_LOG_PATH']) && process.env['XML_LOG_PATH'] || null;
var writeFile = exports.writeFile = function writeFile(fn, data) {
    return new Promise(function (resolve, reject) {
        return _fs2.default.writeFile(fn, data, { mode: 'utf8' }, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
var incomingXmlLog = function incomingXmlLog(xml) {
    var xmlFile = xmlPath ? _path2.default.join(xmlPath, 'incoming_' + (0, _moment2.default)().format() + '.xml') : null;
    return !xmlFile ? Promise.resolve(xml) : writeFile(xmlFile, xml).then(function () {
        return xml;
    });
};
// ---------------------------------------------------------------------------
// Internal Functions --------------------------------------------------------
// ---------------------------------------------------------------------------
/** Iterate over all own properties of object with (value, key) */
var forObj = _ramda2.default.flip(_ramda2.default.mapObjIndexed);
var parseInvoiceExpressDate = function parseInvoiceExpressDate(str) {
    // incoming format for dates from Invoice Express
    var tempDate = (0, _moment2.default)(str, 'DD/MM/YYYY', strictParsing);
    if (tempDate.isValid()) {
        // format expected by the platform
        return tempDate.format('YYYY-MM-DD');
    } else {
        return str;
    }
};
/** Apply function to all keys and sub-keys that match the
 *  given filter(val,key) */
var deepMap = function deepMap(obj, filter, fn) {
    return forObj(obj, function (val, key) {
        // if it's a relevant (final) key, analyse it
        if (filter(val, key)) {
            return fn(val);
            // recurse through objects except if they are Dates or moment
        } else if (val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val !== null && !Array.isArray(val) && !(val instanceof Date)) {
            return deepMap(val, filter, fn);
            // recursive arrays
        } else if (Array.isArray(obj[key])) {
            return val.map(function (item) {
                return deepMap(item, filter, fn);
            });
        } else {
            return val;
        }
    });
};
/** Tags which have the nil === 'true' attribute are correctly
 *  translated into javascript null values
 */
// https://stackoverflow.com/a/774234
var nilAttrToNull = function nilAttrToNull(obj) {
    return deepMap(obj, function (val, _key) {
        return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val && '@' in val && 'nil' in val['@'] && val['@']['nil'] === 'true';
    }, function () {
        return null;
    });
};
// ---------------------------------------------------------------------------
// Configurations ------------------------------------------------------------
// ---------------------------------------------------------------------------
var js2xmlparserOptions = {};
var xml2jsOptions = { explicitArray: false,
    emptyTag: null,
    attrkey: '@',
    charkey: '#',
    valueProcessors: [_processors.parseNumbers, _processors.parseBooleans, parseInvoiceExpressDate]
};
// ---------------------------------------------------------------------------
// External Functions --------------------------------------------------------
// ---------------------------------------------------------------------------
/** Convert from Invoice Express XML format */
var fromXml = exports.fromXml = function fromXml(xml) {
    return incomingXmlLog(xml).then(function () {
        return new Promise(function (resolve, reject) {
            _xml2js2.default.parseString(xml, xml2jsOptions, function (err, data) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve((0, _humps.camelizeKeys)(nilAttrToNull(data)));
                }
            });
        });
    });
};
/** Convert to Invoice Express XML format */
var toXml = exports.toXml = function toXml(root, body) {
    var dateConverted = deepMap((0, _humps.decamelizeKeys)(body), function (val, key) {
        return val && key.search(/.*date.*/i) !== -1 && !Array.isArray(val) && ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object' || val instanceof Date);
    }, function (str) {
        if (str && (typeof str === 'string' || str instanceof Date)) {
            var tempDate = (0, _moment2.default)(str, 'YYYY-MM-DD', strictParsing);
            if (tempDate.isValid()) {
                return tempDate.format('DD/MM/YYYY');
            } else {
                return str;
            }
        } else {
            return str;
        }
    });
    return _js2xmlparser2.default.parse(root, dateConverted, js2xmlparserOptions);
};
//# sourceMappingURL=xml.js.map
