// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import Promise  from 'bluebird';
import R        from 'ramda';

// ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------
import {
  getter
, publisher
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
, ItemCreate
, ItemsCreate
} from '../items';

import {
  Address
, Auth
, IdBase
, SendOptions
, SupportedLanguages
, Type
} from '../sharedInterfaces';

// ---------------------------------------------------------------------------
// Types ---------------------------------------------------------------------
// ---------------------------------------------------------------------------
export interface Client extends Address, Partial<IdBase>
  { id?           : number
  , name          : string
  , code          : string
  , language?     : SupportedLanguages
  , country?      : InvoiceExpressCountry
  , website?      : string
  , phone?        : string
  , fax?          : string
  , observations? : string
  , sendOptions?  : SendOptions
  }

export type TaxExemption
  = 'M01'
  | 'M02'
  | 'M03'
  | 'M04'
  | 'M05'
  | 'M06'
  | 'M07'
  | 'M08'
  | 'M09'
  | 'M10'
  | 'M11'
  | 'M12'
  | 'M13'
  | 'M14'
  | 'M15'
  | 'M16'
  | 'M99'
  ;

export interface InvoiceItemGet extends ItemBase
  { unit          : string
  , quantity      : number
  , tax           : TaxGet
  , discount      : number // between 0 and 100 ?
  , discountAmount: number
  , subtotal      : number
  , taxAmount     : number
  , total         : number
  }

export interface InvoiceItemsGet
  { '@': Type
  , item: Array<InvoiceItemGet>
  }

export type InvoiceStatusBase
  = 'finalized'
  | 'deleted'
  | 'second_copy'
  | 'canceled'
  | 'settled'
  | 'unsettled'
  ;

export type InvoiceStatusChange
  = InvoiceStatusBase
  ;

export type InvoiceStatus
  = InvoiceStatusChange
  | 'draft' // you can't change to draft
  | 'final' // or final?
  ;

export type InvoiceType
  = 'Invoice'
  | 'CashInvoice'
  | 'InvoiceReceipt'
  | 'SimplifiedInvoice'
  | 'CreditNote'
  | 'DebitNote'
  | 'Receipt'
  ;

export type InvoiceCurrency = 'Euro';

// export interface Invoice
  // { date          : string
  // , dueDate       : string
  // , reference?    : string
  // , observations? : string
    // // %, number between 0 and 99.99
  // , retention     : number
  // , taxExemption? : TaxExemption
  // , sequenceId?   : string
  // , manualSequenceNumber? : string
  // , client        : Client
  // , items         : Items
  // , taxRetention? : number
  // , mbReference?  : string
  // };

export interface InvoiceBase
  { date          : string
  , dueDate       : string
  , reference?    : string
  , observations? : string
  , client        : Client
  , retention?    : number
  }

export interface InvoiceCreateRequest
  extends InvoiceBase
  { // %, number between 0 and 99.99
    taxExemption? : TaxExemption
  , sequenceId?   : string
  , manualSequenceNumber? : string
  , items         : ItemsCreate
  , taxRetention? : number
  , mbReference?  : string
  }

export type InvoiceUpdateRequest = InvoiceCreateRequest & { invoiceId: number };

export interface InvoiceGetResponse
  extends InvoiceBase
  { id            : string
  , status        : InvoiceStatus
  , archived      : boolean
  , type          : InvoiceType
  , sequenceNumber: string
  , invertedSequenceNumber?: string
  , permalink     : string
  , saftHash      : string
  , currency      : InvoiceCurrency
  , items         : InvoiceItemsGet
  , sum           : number
  , discount      : number
  , beforeTaxes   : number
  , taxes         : number
  , total         : number
  }

export interface InvoiceListQuery
  { text?                     : string
  , 'type[]'                  : InvoiceType
  , 'status[]'                : InvoiceStatus
  , 'date[from]'?             : string
  , 'date[to]'?               : string
  , 'dueDate[from]'?          : string
  , 'dueDate[to]'?            : string
  , 'totalBeforeTaxes[from]'? : number
  , 'totalBeforeTaxes[to]'?   : number
  , nonArchived?              : boolean
  , archived?                 : boolean
  , page?                     : number
  , perPage?                  : number
  }

export type InvoiceListResponse = InvoiceGetResponse[];

export interface InvoiceChangeStateRequest
  { state   : InvoiceStatusChange
  , message?: string
  }

export interface GeneratePdfResponse
  { pdfUrl : string
  }

// ---------------------------------------------------------------------------
// Invoice URLs --------------------------------------------------------------
// ---------------------------------------------------------------------------
const invoiceUrlFn  = accountName => `${baseUrl(accountName)}/invoice`;
const invoicesUrlFn = accountName => `${baseUrl(accountName)}/invoices`;
const generatePdfUrlFn = accountName => `${baseUrl(accountName)}/api/pdf`;

export const invoiceUrl =
  { create  : ({accountName}) => `${invoicesUrlFn(accountName)}.xml`
  , get     : ({accountName, invoiceId}) =>
                  `${invoicesUrlFn(accountName)}/${invoiceId}.xml`

  , update  : ({accountName, invoiceId}) =>
                  `${invoicesUrlFn(accountName)}/${invoiceId}.xml`
  , listAll : ({accountName}) => `${invoicesUrlFn(accountName)}.xml`
  , changeStatus: ({accountName, invoiceId}) =>
                  `${invoiceUrlFn(accountName)}/${invoiceId}/change-state.xml`
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
    return publisher({ ...postSetup(auth, invoiceUrl.create)
                     , root: this.root
                     , body
                     });
  }

  static get(auth: Auth, invoiceId) : Promise<InvoiceGetResponse> {
    return getter(getSetup(auth, invoiceUrl.get, { invoiceId }))
    .get(this.root);
  }

  // warning: this deletes non updated items
  static update( auth: Auth
               , body: InvoiceUpdateRequest
               , invoiceId : number
               ) : Promise<void> {
    return publisher({ ...putSetup(auth, invoiceUrl.update, {invoiceId})
                     , root: this.root
                     , body
                     });
  }

  static listAll( auth: Auth
                , query: InvoiceListQuery
                ) : Promise<InvoiceGetResponse[]> {
    return getter(listSetup(auth, invoiceUrl.listAll, query))
    // { invoices: { '@': Type, {invoice: InvoiceGetResponse}[] }}
    .get('invoices')
    // {invoice: InvoiceGetResponse}[]
    .get('invoice');
  }

  static changeState( auth: Auth
                    , body: InvoiceChangeStateRequest
                    , invoiceId: number
                    ) : Promise<void> {
    return publisher({ ...putSetup( auth
                                  , invoiceUrl.changeStatus
                                  , {invoiceId}
                                  )
                     , root: this.root
                     , body
                     });
  }

  static generatePDF( auth: Auth
                    , invoiceId: number
                  ): Promise<GeneratePdfResponse>{
    return getter(getSetup(auth, invoiceUrl.generatePdf, { invoiceId }))
    .get('output');
  }

}
