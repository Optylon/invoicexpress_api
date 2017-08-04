import { Auth, PerPage, Type } from '../sharedInterfaces';
export interface TaxName {
    name: string;
}
export interface TaxBase extends TaxName {
    value: number;
}
export declare type TaxRegion = 'PT' | 'PT-AC' | 'PT-MA' | 'Desconhecido';
export declare enum DefaultTaxEnum {
    NonDefaultTax = 0,
    DefaultTax = 1,
}
export interface TaxCreate extends TaxBase {
    region: TaxRegion;
    defaultTax?: DefaultTaxEnum;
}
export interface TaxGet extends TaxBase {
    id: string;
}
export interface ItemBase {
    name: string;
    description: string;
    unitPrice: number;
}
export interface ItemCreate extends ItemBase {
    tax?: TaxName;
}
export interface InvoiceItemCreate extends ItemCreate {
    quantity: number;
}
export interface ItemsCreate {
    '@': Type;
    item: Array<ItemCreate>;
}
export interface InvoiceItemsCreate {
    '@': Type;
    item: Array<InvoiceItemCreate>;
}
export interface ItemsCreateRequest extends ItemCreate {
    unit?: string;
}
export interface ItemsCreateResponse extends ItemsCreateRequest {
    id: string;
    tax: TaxGet;
}
export declare type ItemsGetResponse = ItemsCreateResponse;
export declare type ItemsUpdateRequest = ItemsCreateRequest;
export interface ItemsListQuery {
    page?: number;
    perPage?: PerPage;
}
export declare const itemsUrl: {
    create: ({accountName}: {
        accountName: any;
    }) => string;
    get: ({accountName, itemId}: {
        accountName: any;
        itemId: any;
    }) => string;
    update: ({accountName, itemId}: {
        accountName: any;
        itemId: any;
    }) => string;
    listAll: ({accountName}: {
        accountName: any;
    }) => string;
};
export declare class Items {
    static root: string;
    static create(auth: Auth, body: ItemsCreateRequest): Promise<ItemsGetResponse>;
    static get(auth: Auth, itemId: any): Promise<ItemsGetResponse>;
    static update(auth: Auth, body: ItemsUpdateRequest, itemId: number): Promise<void>;
    static listAll(auth: Auth, query: ItemsListQuery): Promise<ItemsGetResponse[]>;
}
