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
, postSetup
, putSetup
, getSetup
, listSetup
, toArray
} from '../util';

import {
  Auth
, PerPage
, Type
} from '../sharedInterfaces';

// ---------------------------------------------------------------------------
// Types ---------------------------------------------------------------------
// ---------------------------------------------------------------------------
export interface TaxName
  { name   : string
  }

export interface TaxBase extends TaxName
  { // %, 0 <= 100
    value       : number
  }

export type TaxRegion
  = 'PT'            // Portugal Continental
  | 'PT-AC'         // Açores
  | 'PT-MA'         // Madeira
  | 'Desconhecido'  // Unknown
  ;

export enum DefaultTaxEnum
  { NonDefaultTax = 0
  , DefaultTax    = 1
  }

export interface TaxCreate extends TaxBase
  { region      : TaxRegion
  , defaultTax? : DefaultTaxEnum
  }

export interface TaxGet extends TaxBase
  { id : string
  }

// export interface ItemBase
  // { name        : string
  // , description : string
    // // >= 0.0
  // , unitPrice   : number
    // // >= 0
  // , quantity    : number
  // }

export interface ItemBase
  { name        : string
  , description : string
    // >= 0.0
  , unitPrice   : number
  }

export interface ItemCreate extends ItemBase
  {  tax? : TaxName
  }

export interface InvoiceItemCreate
  extends ItemCreate
  { quantity: number
  }

export interface ItemsCreate
  { '@': Type
  , item: Array<ItemCreate>
  }

export interface InvoiceItemsCreate
  { '@': Type
  , item: Array<InvoiceItemCreate>
  }

export interface ItemsCreateRequest extends ItemCreate
  { unit?    : string
  }

export interface ItemsCreateResponse extends ItemsCreateRequest
  { id       : string
  , tax      : TaxGet
  }

export type ItemsGetResponse = ItemsCreateResponse;

export type ItemsUpdateRequest = ItemsCreateRequest;

export interface ItemsListQuery
  { page?    : number
  , perPage? : PerPage
  }

// ---------------------------------------------------------------------------
// Invoice URLs --------------------------------------------------------------
// ---------------------------------------------------------------------------
const itemsUrlFn  = accountName => `${baseUrl(accountName)}/items`;

export const itemsUrl =
  { create  : ({accountName}) => `${itemsUrlFn(accountName)}.xml`
  , get     : ({accountName, itemId}) =>
                  `${itemsUrlFn(accountName)}/${itemId}.xml`
    // TODO: missing delete
  , update  : ({accountName, itemId}) =>
                  `${itemsUrlFn(accountName)}/${itemId}.xml`
  , listAll : ({accountName}) => `${itemsUrlFn(accountName)}.xml`
  };

// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------
export class Items {
  static root = 'invoice';

  static create(
      auth: Auth
    , body: ItemsCreateRequest
    ) : Promise<ItemsGetResponse> {
    return publisher({ ...postSetup(auth, itemsUrl.create)
                     , root: this.root
                     , body
                     });
  }

  static get(auth: Auth, itemId) : Promise<ItemsGetResponse> {
    return getter(getSetup(auth, itemsUrl.get, { itemId }))
    .get(this.root);
  }

  // warning: this deletes non updated items
  static update( auth: Auth
               , body: ItemsUpdateRequest
               , itemId : number
               ) : Promise<void> {
    return publisher({ ...putSetup(auth, itemsUrl.update, {itemId})
                     , root: this.root
                     , body
                     });
  }

  static listAll( auth: Auth
                , query: ItemsListQuery
                ) : Promise<ItemsGetResponse[]> {
    return getter(listSetup(auth, itemsUrl.listAll, query))
    // { invoices: { '@': Type, {invoice: ItemsGetResponse}[] }}
    .get('items')
    // {invoice: ItemsGetResponse}[]
    .get('item')
    // xml lib places single element array as single object
    // we do not want that
    .then(data => toArray(data));
  }

}
