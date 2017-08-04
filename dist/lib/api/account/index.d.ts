import * as I from '../sharedInterfaces';
import { InvoiceExpressCountry, InvoiceExpressCountryCode } from '../../../lib/country';
import { Address, Id, IdBase, SupportedLanguages, TermsAndConditions } from '../sharedInterfaces';
export interface AccountBase extends IdBase {
    organizationName: string;
}
export interface AccountCreateRequest extends AccountBase {
    firstName?: string;
    lastName?: string;
    phone?: string;
    password: string;
    taxCountry: InvoiceExpressCountryCode | InvoiceExpressCountry;
    language: SupportedLanguages;
    terms: TermsAndConditions;
}
export interface AccountUpdateRequest extends AccountBase, Address {
}
export declare type AccountState = 'active' | 'inactive' | 'pending';
export declare type RoleType = 'administrator' | 'contributor';
export interface Role {
    role: RoleType;
}
export declare type Roles = Role[];
export interface AccountStatus {
    state: AccountState;
}
export interface AccountCreateResponse extends AccountStatus {
    id: number;
    name: string;
    url: string;
    apiKey: string;
}
export interface AccountGetResponse extends AccountBase, AccountStatus {
    atConfigured: boolean;
}
export declare const accountUrl: {
    create: () => string;
    get: ({accountName, accountId}: {
        accountName: any;
        accountId: any;
    }) => string;
    suspend: ({accountName, accountId}: {
        accountName: any;
        accountId: any;
    }) => string;
    activate: ({accountName, accountId}: {
        accountName: any;
        accountId: any;
    }) => string;
    update: ({accountName, accountId}: {
        accountName: any;
        accountId: any;
    }) => string;
};
export declare class Account {
    static root: string;
    static create(body: AccountCreateRequest): Promise<AccountCreateResponse>;
    static get(auth: I.Auth, accountId: Id): Promise<AccountGetResponse>;
    static suspend(auth: I.Auth, accountId: Id): Promise<void>;
    static activate(auth: I.Auth, accountId: Id): Promise<void>;
    static update(auth: I.Auth, accountId: Id, body: AccountUpdateRequest): Promise<void>;
}
