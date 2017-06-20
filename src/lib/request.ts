// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import Promise      from 'bluebird';
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

// ---------------------------------------------------------------------------
// External Functions --------------------------------------------------------
// ---------------------------------------------------------------------------
export const publisher =
  ({method, apiKey, body, url, root} : Publisher) =>
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
    });

export const getter =
  ({apiKey, url}) =>
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
  });
