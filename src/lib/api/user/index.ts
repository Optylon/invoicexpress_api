// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import util     from 'util';

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
, toArray
} from '../util';

import {
  AccountCreateResponse
, AccountStatus
, Roles
} from '../account';

import {
  Auth
, IdBase
, SupportedLanguages
, TermsAndConditions
} from '../sharedInterfaces';

// ---------------------------------------------------------------------------
// Types ---------------------------------------------------------------------
// ---------------------------------------------------------------------------
export interface Credentials
  { login   : string
  , password: string
  }

export interface AccountLoginInformation
  extends AccountCreateResponse, AccountStatus
  { blocked : boolean
  , roles   : Roles
  }

export type UserLoginResponse = AccountLoginInformation[];

export type UserAccountsResponse = AccountLoginInformation[];

// ---------------------------------------------------------------------------
// User URLs -----------------------------------------------------------------
// ---------------------------------------------------------------------------
export const userUrl =
  { login   : () => `${baseUrl('www')}/login.xml`
  , accounts: () => `${baseUrl('www')}/users/accounts.xml`
  , changeAccount: ({accountName}) =>
                    `${baseUrl(accountName)}/users/change_account.xml`
  };

export function debug(x) {
  return util.inspect(x,{ depth: null, colors: true });
}

// ---------------------------------------------------------------------------
// External Class ------------------------------------------------------------
// ---------------------------------------------------------------------------
export class User {

  static login(body: Credentials) : Promise<UserLoginResponse> {
    return publisher({ ...unAuthPostSetup(userUrl.login)
                     , root: 'credentials'
                     , body
                     })
    // { accounts: { account: AccountLoginInformation}[]}
    .get('accounts')
    // { account: AccountLoginInformation}[]
    .get('account')
    // xml lib places single element array as single object
    // we do not want that
    .then(data => toArray(data));
    // AccountLoginInformation[]
  }

  static accounts(auth: Auth) : Promise<UserAccountsResponse> {
    return getter(getSetup(auth, userUrl.accounts, { }))
    // { accounts: { account: AccountLoginInformation}[]}
    .get('accounts')
    // { account: AccountLoginInformation}[]
    .get('account')
    // xml lib places single element array as single object
    // we do not want that
    .then(data => toArray(data));
    // AccountLoginInformation[]
  }

  static changeAccount(auth: Auth, id) : Promise<void> {
    return publisher({ ...putSetup(auth, userUrl.changeAccount, {id})
                     , root: 'change_account_to'
                     });
  }
}
