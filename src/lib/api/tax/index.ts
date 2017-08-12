// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import request  from 'request-promise';
import errors   from 'request-promise/errors';
import R        from 'ramda';

// ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------
import {
  getter
, publisher
, getErrorString
} from '../../request';

import {
  baseUrl
, unAuthPostSetup
, postSetup
, putSetup
, getSetup
, listSetup
} from '../util';

import {
  debug
} from '../../../utils';

import {
  Auth
, IdBase
, SupportedLanguages
, TermsAndConditions
} from '../sharedInterfaces';

import {
  InvoiceGetResponse
} from '../invoice';

import {
  InvalidInvoiceXpressAPIKey
, InvoiceXpressElementAlreadyExists
, InvoiceXpressInvalidName
, InvoiceXpressUnexpectedError
} from '../../errors';

// ---------------------------------------------------------------------------
// Types ---------------------------------------------------------------------
// ---------------------------------------------------------------------------
export interface TaxCreateRequest
  { name         : string
  , value        : number
    // TODO: missing region and default tax
  }

export interface TaxCreateResponse
  extends TaxCreateRequest
  { id: number
  }

// ---------------------------------------------------------------------------
// Tax URLs -------------------------------------------------------------
// ---------------------------------------------------------------------------
const taxUrlFn  = accountName => `${baseUrl(accountName)}/taxes`;

export const taxUrl =
  { create  : ({accountName}) => `${taxUrlFn(accountName)}.xml`
  };

// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------
export class Tax {
  static root = 'tax';

  static create(
      auth: Auth
    , body: TaxCreateRequest
    ) : Promise<TaxCreateResponse> {
    return publisher({ ...postSetup(auth, taxUrl.create)
                     , root: this.root
                     , body
                     })
    .get('tax')
    .catch(errors.StatusCodeError, err => {
      switch (err.statusCode) {
        case 401: throw new InvalidInvoiceXpressAPIKey(debug(auth));
        case 422:
          if (getErrorString(err.error) === 'Tax name already exists.') {
            throw new InvoiceXpressElementAlreadyExists(
               `Create tax: ${debug(body)}`
            );
          } else if (getErrorString(err.error) ===
                      'The tax name is invalid') {
            throw new InvoiceXpressInvalidName(
               `Create tax: ${debug(body)}`
            );
          } else {
            throw new InvoiceXpressUnexpectedError(
               `Create tax: ${debug(body)}`
            );
          }
        default : throw err;
      }
    });

  }
}
