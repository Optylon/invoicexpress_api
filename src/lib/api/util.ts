// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import request  from 'request-promise';
import errors   from 'request-promise/errors';
import humps    from 'humps';
import R        from 'ramda';

// ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------
import {
  getter
, publisher
} from '../request';

import * as I   from '../api/sharedInterfaces';
import * as Api from '../api/';

// ---------------------------------------------------------------------------
// Types ---------------------------------------------------------------------
// ---------------------------------------------------------------------------
export interface GenericObj { [keys: string]: any }

export interface Getter
  { apiKey: string
  , url: string
  }

export interface Publisher
  { method: string
  , apiKey?: string
  , body?: Api.AccountCreateRequest
         | Api.AccountUpdateRequest
         | Api.Credentials
         | Api.InvoiceCreateRequest
         | Api.InvoiceChangeStateRequest
         | Api.SequenceCreateRequest
         | Api.ItemsCreateRequest
  , url: string
  , root?: string
  }

// ---------------------------------------------------------------------------
// Internal API url functions ------------------------------------------------
// ---------------------------------------------------------------------------
export const baseUrl = accountName =>
  `https://${accountName}.app.invoicexpress.com`;

// ---------------------------------------------------------------------------
// Internal API request functions --------------------------------------------
// ---------------------------------------------------------------------------
export interface PublisherPost
  { method: string
  , apiKey?: string
  , url: string
  }

export type PublisherPut = PublisherPost;

export const unAuthPostSetup = (urlFn) : PublisherPost =>
  ( { method: 'POST'
    , url: urlFn()
    });

export const postSetup = (auth: I.Auth, urlFn) : PublisherPost => {
  const { accountName, apiKey } = auth;
  return (
    { method: 'POST'
    , apiKey
    , url: urlFn({accountName})
    });
  };

export const putSetup = (auth: I.Auth, urlFn, data) : PublisherPut => {
  const { accountName, apiKey } = auth;
  return (
    { method: 'PUT'
    , apiKey
    , url: urlFn({accountName, ...data})
    });
  };

export const getSetup = (auth: I.Auth, urlFn, data = {}) : I.Getter => {
  const { accountName, apiKey } = auth;
  return (
    { apiKey
    , url: urlFn({accountName, ...data})
    });
  };

export const listSetup =
  ( auth: I.Auth
  , urlFn
  , params: GenericObj
  ) : I.Getter => {
  const { accountName, apiKey } = auth;
  const formattedParams =
    Object.entries(humps.decamelizeKeys(params))
          .map(([key,value]) => `${key}=${value}`)
          .join('&');
  return (
    { apiKey
    , url: `${urlFn({accountName})}?${formattedParams}`
    });
  };

// ---------------------------------------------------------------------------
// Internal API utility functions --------------------------------------------
// ---------------------------------------------------------------------------

/** Assure all array returning functions really return arrays
 *  and not single object when array.length === 1
 */
export const toArray = (arrayOrElement) => Array.isArray(arrayOrElement)
                                          ? arrayOrElement
                                          : [arrayOrElement];
