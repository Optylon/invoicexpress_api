// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import Promise  from 'bluebird';
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
export interface SequenceCreateRequest
  { serie             : string
  , defaultSequence?  : number
  }

export interface SequenceGetResponse
  { id                                   : number
  , serie                              : string
  , defaultSequence                    : number
  , currentInvoiceNumber               : number
  , currentInvoiceSequenceId           : number
  , currentInvoiceReceiptNumber        : number
  , currentInvoiceReceiptSequenceId    : number
  , currentSimplifiedInvoiceNumber     : number
  , currentSimplifiedInvoiceSequenceId : number
  , currentCreditNoteNumber            : number
  , currentCreditNoteSequenceId        : number
  , currentDebitNoteNumber             : number
  , currentDebitNoteSequenceId         : number
  , currentReceiptNumber               : number
  , currentReceiptSequenceId           : number
  , currentShippingNumber              : number
  , currentShippingSequenceId          : number
  , currentTransportNumber             : number
  , currentTransportSequenceId         : number
  , currentDevolutionNumber            : number
  , currentDevolutionSequenceId        : number
  , currentProformaNumber              : number
  , currentProformaSequenceId          : number
  , currentQuoteNumber                 : number
  , currentQuoteSequenceId             : number
  , currentFeesNoteNumber              : number
  , currentFeesNoteSequenceId          : number
  }
// ---------------------------------------------------------------------------
// Sequence URLs -------------------------------------------------------------
// ---------------------------------------------------------------------------
const sequenceUrlFn  = accountName => `${baseUrl(accountName)}/sequences`;

export const sequenceUrl =
  { create  : ({accountName}) => `${sequenceUrlFn(accountName)}.xml`
  , get     : ({accountName, sequenceId}) =>
                `${sequenceUrlFn(accountName)}/${sequenceId}.xml`
  , update  : ({accountName, sequenceId}) =>
                `${sequenceUrlFn(accountName)}/${sequenceId}/set_current.xml`
  , listAll : ({accountName}) => `${sequenceUrlFn(accountName)}.xml`
  };

// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------
export class Sequence {
  static root = 'sequence';

  static create(
      auth: Auth
    , body: SequenceCreateRequest
    ) : Promise<InvoiceGetResponse> {
    return publisher({ ...postSetup(auth, sequenceUrl.create)
                     , root: this.root
                     , body
                     })
    .catch(errors.StatusCodeError, err => {
      switch (err.statusCode) {
        case 401: throw new InvalidInvoiceXpressAPIKey(debug(auth));
        case 422:
          if (getErrorString(err.error) === 'Sequence name already exists.') {
            throw new InvoiceXpressElementAlreadyExists(
               `Create sequence: ${debug(body)}`
            );
          } else if (getErrorString(err.error) ===
                      'The sequence name is invalid') {
            throw new InvoiceXpressInvalidName(
               `Create sequence: ${debug(body)}`
            );
          } else {
            throw new InvoiceXpressUnexpectedError(
               `Create sequence: ${debug(body)}`
            );
          }
        default : throw err;
      }
    });

  }

  static get(
      auth: Auth
    , sequenceId: number
    ) : Promise<SequenceGetResponse>{
     return getter(getSetup(auth, sequenceUrl.get, { sequenceId }))
    .get('sequence')
    .catch(errors.StatusCodeError, err => {
      switch (err.statusCode) {
        case 401: throw new InvalidInvoiceXpressAPIKey(debug(auth));
        case 404:
          if (getErrorString(err.error) === 'No sequence matches') {
            throw new InvoiceXpressElementAlreadyExists(
               `Get sequence: ${sequenceId}`
            );
          }
        default : throw err;
      }
    });
  }

  static update(
      auth: Auth
    , sequenceId: number
    ) : Promise<SequenceGetResponse>{
      return publisher(putSetup(auth, sequenceUrl.update, { sequenceId }));
  }

  static listAll( auth: Auth
  ) : Promise<Array<SequenceGetResponse>> {
    return getter(getSetup(auth, sequenceUrl.listAll))
    .get('sequences')
    .get('sequence');
  }
}
