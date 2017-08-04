import * as I from '../api/sharedInterfaces';
import * as Api from '../api/';
export interface GenericObj {
    [keys: string]: any;
}
export interface Getter {
    apiKey: string;
    url: string;
}
export interface Publisher {
    method: string;
    apiKey?: string;
    body?: Api.AccountCreateRequest | Api.AccountUpdateRequest | Api.Credentials | Api.InvoiceCreateRequest | Api.InvoiceChangeStateRequest | Api.SequenceCreateRequest | Api.ItemsCreateRequest;
    url: string;
    root?: string;
}
export declare const baseUrl: (accountName: any) => string;
export interface PublisherPost {
    method: string;
    apiKey?: string;
    url: string;
}
export declare type PublisherPut = PublisherPost;
export declare const unAuthPostSetup: (urlFn: any) => PublisherPost;
export declare const postSetup: (auth: I.Auth, urlFn: any) => PublisherPost;
export declare const putSetup: (auth: I.Auth, urlFn: any, data: any) => PublisherPost;
export declare const getSetup: (auth: I.Auth, urlFn: any, data?: {}) => I.Getter;
export declare const listSetup: (auth: I.Auth, urlFn: any, params: GenericObj) => I.Getter;
/** Assure all array returning functions really return arrays
 *  and not single object when array.length === 1
 */
export declare const toArray: (arrayOrElement: any) => any[];
