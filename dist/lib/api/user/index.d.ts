import { AccountCreateResponse, AccountStatus, Roles } from '../account';
import { Auth } from '../sharedInterfaces';
export interface Credentials {
    login: string;
    password: string;
}
export interface AccountLoginInformation extends AccountCreateResponse, AccountStatus {
    blocked: boolean;
    roles: Roles;
}
export declare type UserLoginResponse = AccountLoginInformation[];
export declare type UserAccountsResponse = AccountLoginInformation[];
export declare const userUrl: {
    login: () => string;
    accounts: () => string;
    changeAccount: ({accountName}: {
        accountName: any;
    }) => string;
};
export declare function debug(x: any): string;
export declare class User {
    static login(body: Credentials): Promise<UserLoginResponse>;
    static accounts(auth: Auth): Promise<UserAccountsResponse>;
    static changeAccount(auth: Auth, id: any): Promise<void>;
}
