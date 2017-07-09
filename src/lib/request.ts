// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import blueRetry    from 'bluebird-retry';
import request      from 'request-promise';
import errors       from 'request-promise/errors';
import js2xmlparser from 'js2xmlparser';
import xml2js       from 'xml2js';
import moment       from 'moment';
import log          from 'winston';
import R            from 'ramda';

import {
  camelizeKeys
, decamelizeKeys
} from 'humps';

// ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------
import options from '../utils/options';

import {
  toXml
, fromXml
} from '../utils/xml';

import {
  Publisher
} from './api/util';

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
const retry = R.flip(blueRetry)(
  { interval : 2 * 60 * 1000 / 100
  , backoff  : 2
  , max_interval: 1000
  , max_tries: 6
  , predicate: (err) => err instanceof request.StatusCodeError
                            && ( err.statusCode === '429'
                              || err.statusCode === 429)
  , throw_original: true
  });

// ---------------------------------------------------------------------------
// External Functions --------------------------------------------------------
// ---------------------------------------------------------------------------
export const publisher =
  ({method, apiKey, body, url, root} : Publisher) => retry(
    request({...options
                    , method
                    , url
                    , qs: {api_key: apiKey}
                    , body: body ? toXml(root, decamelizeKeys(body)) : ''
                    })
    // For status code !== 2xx
    .catch(errors.StatusCodeError, reason => {
      log.error(`${method}@${url}/${root}: [${reason.statusCode}] ` +
                `${reason.response}`);
      throw reason;
    })
  );

export const getter =
  ({apiKey, url}) => retry(
  request.get({...options
              , url
              , qs: {api_key: apiKey}
              })
  .then(xmlData => fromXml(xmlData))
  .then(convertedXml => camelizeKeys(convertedXml))
  // For status code !== 2xx
  .catch(errors.StatusCodeError, reason => {
    log.error(`GET@${url} : [${reason.statusCode}] ` +
              `${reason.response}`);
    throw reason;
  })
);
