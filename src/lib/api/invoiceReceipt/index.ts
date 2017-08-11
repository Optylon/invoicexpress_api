// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
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
, toArray
} from '../util';

import {
  InvoiceExpressCountry
, InvoiceExpressCountryCode
} from '../../../lib/country';

import {
  TaxName
, TaxBase
, DefaultTaxEnum
, TaxCreate
, TaxGet
, ItemBase
, InvoiceItemsCreate
} from '../items';

import {
  Address
, Auth
, IdBase
, SendOptions
, SupportedLanguages
, Type
} from '../sharedInterfaces';

import {
  debug
} from '../../../utils';

import {
  InvalidInvoiceXpressAPIKey
, InvoiceXpressInvalidClient
, InvoiceXpressNotArray
, InvoiceXpressUnkownCountry
, InvoiceXpressUnexpectedError
} from '../../errors';

import {
  InvoiceCreateRequest
, InvoiceGetResponse
, InvoiceListQuery
, InvoiceChangeStateRequest
, InvoiceUpdateRequest
, GeneratePdfResponse
} from '../invoice';

// ---------------------------------------------------------------------------
// Invoice URLs --------------------------------------------------------------
// ---------------------------------------------------------------------------
const invoiceReceiptUrlFn  = accountName =>
  `${baseUrl(accountName)}/invoice_receipts`;
  
const generatePdfUrlFn = accountName =>
  `${baseUrl(accountName)}/api/pdf`;

export const invoiceReceiptUrl =
  { create  : ({accountName}) => `${invoiceReceiptUrlFn(accountName)}.xml`
  , get     : ({accountName, invoiceId}) =>
      `${invoiceReceiptUrlFn(accountName)}/${invoiceId}.xml`
  , update  : ({accountName, invoiceId}) =>
      `${invoiceReceiptUrlFn(accountName)}/${invoiceId}.xml`
  , listAll : ({accountName}) => `${invoiceReceiptUrlFn(accountName)}.xml`
  , changeStatus: ({accountName, invoiceId}) =>
      `${invoiceReceiptUrlFn(accountName)}/${invoiceId}/change-state.xml`
  , generatePdf: ({accountName, invoiceId}) =>
      `${generatePdfUrlFn(accountName)}/${invoiceId}.xml`
  };

// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------
export class Invoice {
  static root = 'invoice';

  static create(
      auth: Auth
    , body: InvoiceCreateRequest
    ) : Promise<InvoiceGetResponse> {
    return publisher({ ...postSetup(auth, invoiceReceiptUrl.create)
                     , root: this.root
                     , body
                     })
    .catch(errors.StatusCodeError, err => {
      switch (err.statusCode) {
        case 401: throw new InvalidInvoiceXpressAPIKey(debug(auth));
        // TODO: still more errors to check
        case 422:
          if (getErrorString(err.error) ===
                'Items element should be of type array') {
            throw new InvoiceXpressNotArray(
               `Create invoice items: ${debug(body)}`
            );
          } else if (getErrorString(err.error).startsWith('Country')) {
            throw new InvoiceXpressUnkownCountry(
               `Create invoice country: ${debug(body)}`
            );
          } else if (getErrorString(err.error) === 'Client is invalid') {
            throw new InvoiceXpressInvalidClient(
               `Create invoice country: ${debug(body)}`
            );
          } else {
            throw new InvoiceXpressUnexpectedError(
               `Create invoice: ${err.error} ${debug(body)}`
            );
          }
        default : throw err;
      }
    });

  }

  static get(auth: Auth, invoiceId) : Promise<InvoiceGetResponse> {
    return getter(getSetup(auth, invoiceReceiptUrl.get, { invoiceId }))
    .get(this.root);
  }

  // warning: this deletes non updated items
  static update( auth: Auth
               , body: InvoiceUpdateRequest
               , invoiceId : number
               ) : Promise<void> {
    return publisher({ ...putSetup(auth, invoiceReceiptUrl.update, {invoiceId})
                     , root: this.root
                     , body
                     });
  }

  static listAll( auth: Auth
                , query: InvoiceListQuery
                ) : Promise<InvoiceGetResponse[]> {
    return getter(listSetup(auth, invoiceReceiptUrl.listAll, query))
    // { invoices: { '@': Type, {invoice: InvoiceGetResponse}[] }}
    .get('invoices')
    // {invoice: InvoiceGetResponse}[]
    .get('invoice')
    // xml lib places single element array as single object
    // we do not want that
    .then(data => toArray(data));
  }

  static changeState( auth: Auth
                    , body: InvoiceChangeStateRequest
                    , invoiceId: number
                    ) : Promise<void> {
    return publisher({ ...putSetup( auth
                                  , invoiceReceiptUrl.changeStatus
                                  , {invoiceId}
                                  )
                     , root: this.root
                     , body
                     });
  }

  static generatePDF( auth: Auth
                    , invoiceId: number
                  ): Promise<GeneratePdfResponse>{
    return getter(getSetup(auth, invoiceReceiptUrl.generatePdf, { invoiceId }))
    .get('output');
  }

}
