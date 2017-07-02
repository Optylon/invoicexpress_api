// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import Promise  from 'bluebird';

// ---------------------------------------------------------------------------
// Project modules -----------------------------------------------------------
// ---------------------------------------------------------------------------
import * as I    from '../sharedInterfaces';

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
  Address
, Id
, IdBase
, SupportedLanguages
, TermsAndConditions
} from '../sharedInterfaces';

// ---------------------------------------------------------------------------
// Types ---------------------------------------------------------------------
// ---------------------------------------------------------------------------
export interface AccountBase extends IdBase
  { organizationName  : string
  }

export interface AccountCreateRequest extends AccountBase
  { firstName?        : string
  , lastName?         : string
  , phone?            : string
  , password          : string
  , taxCountry        : InvoiceExpressCountryCode | InvoiceExpressCountry
  , language          : SupportedLanguages
  , terms             : TermsAndConditions
  }

export interface AccountUpdateRequest extends AccountBase, Address
  {}

export type AccountState = 'active' | 'inactive' | 'pending';

export type RoleType = 'administrator' | 'contributor';

export interface Role
  { role : RoleType
  }

export type Roles = Role[];

export interface AccountStatus
  {  state     : AccountState
  }

export interface AccountCreateResponse extends AccountStatus
  { id        : number
    // organizationName
  , name      : string
  , url       : string
  , apiKey    : string
  }

export interface AccountGetResponse extends AccountBase, AccountStatus
      // autoridade tributária configured??
  {  atConfigured : boolean
  }
// ---------------------------------------------------------------------------
// Account URLs --------------------------------------------------------------
// ---------------------------------------------------------------------------
const accountUrlFn = accountName => `${baseUrl(accountName)}/api/accounts`;
export const accountUrl =
  { /** The account creation URL is fixed, does not receive any meaningful
     *  parameter, however for coherency we keep it as a function
     */
    create  : () => `${baseUrl('www')}/api/accounts/create.xml`
  , get     : ({accountName, accountId}) =>
                    `${accountUrlFn(accountName)}/${accountId}/get.xml`
  , suspend : ({accountName, accountId}) =>
                    `${accountUrlFn(accountName)}/${accountId}/suspend.xml`
  , activate: ({accountName, accountId}) =>
                    `${accountUrlFn(accountName)}/${accountId}/activate.xml`
  , update: ({accountName, accountId}) =>
                    `${accountUrlFn(accountName)}/${accountId}/update.xml`
  };

// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------
export class Account {
  static root = 'account';

  static create(
      body: AccountCreateRequest
    ) : Promise<AccountCreateResponse> {
    return publisher({ ...unAuthPostSetup(accountUrl.create)
                     , root: this.root
                     , body
                     });
  }

  static get(auth: I.Auth, accountId: Id) : Promise<AccountGetResponse> {
    return getter(getSetup(auth, accountUrl.get, { accountId }))
    .get(this.root)
    // invoice express allows for vat numbers like PT513222000
    // which are not numbers at all. So, for consistency, we always convert
    // to string
    .then(accountData =>
      'fiscalId' in accountData && accountData.fiscalId
      ? {...accountData, fiscalId: accountData.fiscalId.toString() }
      : accountData
    );
  }

  static suspend(auth: I.Auth, accountId: Id) : Promise<void> {
    return publisher({ ...putSetup(auth, accountUrl.suspend, {accountId})
                     });
  }

  static activate(auth: I.Auth, accountId: Id) : Promise<void> {
    return publisher({ ...putSetup(auth, accountUrl.activate, {accountId})
                     });
  }

  static update( auth: I.Auth
               , accountId: Id
               , body: AccountUpdateRequest) : Promise<void> {
    return publisher({ ...putSetup(auth, accountUrl.update, {accountId})
                     , root: this.root
                     , body
                     });
  }
  // TODO: missing stats
}
