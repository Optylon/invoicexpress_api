// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import Promise      from 'bluebird';
import request      from 'request-promise';
import js2xmlparser from 'js2xmlparser';
import xml2js       from 'xml2js';
import moment       from 'moment';
import R            from 'ramda';
// for debugging purposes only
import fs           from 'fs';
import path         from 'path';

import {
  parseBooleans
, parseNumbers
} from 'xml2js/lib/processors';

import {
  camelizeKeys
, decamelizeKeys
} from 'humps';

// ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------
import {
  invoiceExpressDateFormat
, platformDateFormat
} from './constants';

import {
  debug
} from '../utils';

// ---------------------------------------------------------------------------
// Constants -----------------------------------------------------------------
// ---------------------------------------------------------------------------

/** moment.js parse mode */
const strictParsing = true;

// ---------------------------------------------------------------------------
// Debuging features ---------------------------------------------------------
// ---------------------------------------------------------------------------
const xmlPath = fs.existsSync(process.env['XML_LOG_PATH'])
              && process.env['XML_LOG_PATH'] || null;

export const writeFile =
  Promise.promisify((fn: string,data: any,cb) =>
                                    fs.writeFile(fn,data,'utf8',cb));

const incomingXmlLog = xml => {
  const xmlFile = xmlPath ? path.join(xmlPath
                                     , `incoming_${moment().format()}.xml`)
                          : null;
  return !xmlFile ? Promise.resolve(xml)
                  : writeFile(xmlFile, xml).then(() => xml);
};

// ---------------------------------------------------------------------------
// Internal Functions --------------------------------------------------------
// ---------------------------------------------------------------------------

/** Iterate over all own properties of object with (value, key) */
const forObj = R.flip(R.mapObjIndexed);

const parseInvoiceExpressDate = str => {
  // incoming format for dates from Invoice Express
  const tempDate = moment(str, 'DD/MM/YYYY', strictParsing);
  if (tempDate.isValid()) {
    // format expected by the platform
    return tempDate.format('YYYY-MM-DD');
  } else {
    return str;
  }
};

/** Apply function to all keys and sub-keys that match the
 *  given filter(val,key) */
const deepMap = (obj, filter, fn) =>
  forObj(obj, (val, key) => {
    // if it's a relevant (final) key, analyse it
    if (   filter(val,key)) {
      return fn(val);
    // recurse through objects except if they are Dates or moment
    } else if (val && typeof val === 'object'
                   && val !== null
                   && !Array.isArray(val)
                   && !(val instanceof Date)
              ) {
      return deepMap(val, filter,  fn);
      // recursive arrays
    } else if (Array.isArray(obj[key])) {
      return val.map(item => deepMap(item, filter, fn));
    } else {
      return val;
    }
  });

/** Tags which have the nil === 'true' attribute are correctly
 *  translated into javascript null values
 */
// https://stackoverflow.com/a/774234
const nilAttrToNull = (obj) =>
  deepMap( obj
         , (val, _key) => typeof val === 'object'
                       && '@' in val
                       && 'nil' in val['@']
                       && val['@']['nil'] === 'true'
         , () => null);

// ---------------------------------------------------------------------------
// Configurations ------------------------------------------------------------
// ---------------------------------------------------------------------------
const js2xmlparserOptions =
  { };

const xml2jsOptions : xml2js.Options =
  { explicitArray: false
  , emptyTag: null
  , attrkey: '@'
  , charkey: '#'
  , valueProcessors: [ parseNumbers
                     , parseBooleans
                     , parseInvoiceExpressDate
                     ]
  };

// ---------------------------------------------------------------------------
// External Functions --------------------------------------------------------
// ---------------------------------------------------------------------------
/** Convert from Invoice Express XML format */
export const fromXml = (xml) =>
  incomingXmlLog(xml)
  .then(() =>
    new Promise((resolve, reject)=>{
      xml2js.parseString(xml, xml2jsOptions, (err, data)=>{
        if (err) {
          return reject(err);
        } else {
          return resolve(camelizeKeys(nilAttrToNull(data)));
        }
      });
    })
  );

/** Convert to Invoice Express XML format */
export const toXml = (root, body) => {
  const dateConverted = deepMap(
        decamelizeKeys(body)
      , (val, key) =>
          val
          && key.search(/.*date.*/i) !== -1
          && !Array.isArray(val)
          && (typeof val !== 'object' || val instanceof Date)
      , str => {
    if (str && ( typeof str === 'string'
               || str instanceof Date))  {
      const tempDate = moment(str, 'YYYY-MM-DD', strictParsing);
      if (tempDate.isValid()) {
        return tempDate.format('DD/MM/YYYY');
      } else {
        return str;
      }
    } else {
      return str;
    }
  });
  return js2xmlparser.parse(root, dateConverted, js2xmlparserOptions);
};
