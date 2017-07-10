// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import blueRetry    from 'bluebird-retry';
import request      from 'request-promise';
import contentType  from 'content-type';
import errors       from 'request-promise/errors';
import js2xmlparser from 'js2xmlparser';
import xml2js       from 'xml2js';
import moment       from 'moment';
import log          from 'winston';
import R            from 'ramda';

// ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------
import {
  toXml
, fromXml
} from '../utils/xml';

import {
  debug
} from '../utils';

import {
  Publisher
} from './api/util';

import {
  InvoiceXpressInvalidId
} from './errors';

// ---------------------------------------------------------------------------
// Internal Functions --------------------------------------------------------
// ---------------------------------------------------------------------------

// https://invoicexpress.com/api/introduction/request-limits
// You can perform up to 100 requests per minute from the same IP address.
// If you exceed this limit, you’ll get a 429 Too Many Requests response for
// subsequent requests.
//
// We recommend you handle 429 responses so your integration retries
// requests automatically.
//
// ATTN: our experience is that they cannot even handle that, hence the times 2
const retry = prms => blueRetry(prms,
  { interval : 2 * 60 * 1000 / 100
  , backoff  : 2
  , max_interval: 1000
  , max_tries: 6
  , predicate: err => err instanceof errors.StatusCodeError
                            && err.statusCode === 429
  , throw_original: true
  });

const requestOptions = {
  headers: {
    'content-type': 'application/xml',
    charset: 'utf8',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) ' +
                  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                  'Chrome/46.0.2490.80 Safari/537.36',
    accept: '*/*'
  },
  // simple: true,
  // resolveWithFullResponse: true,
};

// ---------------------------------------------------------------------------
// External Functions --------------------------------------------------------
// ---------------------------------------------------------------------------
export const publisher =
  ({method, apiKey, body, url, root} : Publisher) =>
  request({...requestOptions
          , method
          , url
          , qs: {api_key: apiKey}
          , body: body ? toXml(root, body) : ''
          })
  // For status code !== 2xx
  .catch(errors.StatusCodeError, res => {
    log.error(`${method}@${url}/${root}: [${res.statusCode}] ` +
              `${debug(res.error)}`);
    if (res.statusCode !== 401) {
      return fromXml(res.error)
      .then(decodedError => {
        // we need to recreate the error from scratch :(
        throw new errors.StatusCodeError( res.statusCode
                                        , decodedError
                                        , res.options
                                        , res.response);
      });
    } else {
      throw res;
    }
  })
  .then(result => fromXml(result));

export const getter =
  ({apiKey, url}) =>
  request.get({...requestOptions
              , url
              , qs: {api_key: apiKey}
              })
  // For status code !== 2xx
  .catch(errors.StatusCodeError, res => {
    log.error(`GET@${url} : [${res.statusCode}] ` +
              `${debug(res.error)}`);
    if (res.statusCode === 404) {
      throw new InvoiceXpressInvalidId(`${url}`);
    } else {
      throw res;
    }
  })
  .then(result => fromXml(result));

export function getErrorString(errr) {
    //        InvX  Invx
  return errr.errors.error;
}
