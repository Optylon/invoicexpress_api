// ---------------------------------------------------------------------------
// 'External' modules --------------------------------------------------------
// ---------------------------------------------------------------------------
import Promise  from 'bluebird';

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
// ---------------------------------------------------------------------------
// User URLs -----------------------------------------------------------------
// ---------------------------------------------------------------------------
export const userUrl =
  { login   : () => `${baseUrl('www')}/login.xml`
  , accounts: () => `${baseUrl('www')}/users/accounts.xml`
  , changeAccount: ({accountName}) =>
                    `${baseUrl(accountName)}/users/change_account.xml`
  };

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
    .map(accnt => accnt.account);
    // AccountLoginInformation[]
  }

  static accounts(auth: Auth) : Promise<UserLoginResponse> {
    return getter(getSetup(auth, userUrl.accounts, { }))
    // { accounts: { account: AccountLoginInformation}[]}
    .get('accounts')
    // { account: AccountLoginInformation}[]
    .map(accnt => accnt.account);
    // AccountLoginInformation[]
  }

  static changeAccount(auth: Auth, id) : Promise<void> {
    return publisher({ ...putSetup(auth, userUrl.changeAccount, {id})
                     , root: 'change_account_to'
                     });
  }
}
