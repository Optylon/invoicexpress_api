import { InvoiceExpressCountry } from '../../../lib/country';
import { TaxGet, ItemBase, InvoiceItemsCreate } from '../items';
import { Address, Auth, IdBase, SendOptions, SupportedLanguages, Type } from '../sharedInterfaces';
export interface Client extends Address, Partial<IdBase> {
    id?: number;
    name: string;
    code: string;
    language?: SupportedLanguages;
    country?: InvoiceExpressCountry;
    website?: string;
    phone?: string;
    fax?: string;
    observations?: string;
    sendOptions?: SendOptions;
}
export declare type TaxExemption = 'M01' | 'M02' | 'M03' | 'M04' | 'M05' | 'M06' | 'M07' | 'M08' | 'M09' | 'M10' | 'M11' | 'M12' | 'M13' | 'M14' | 'M15' | 'M16' | 'M99';
export interface InvoiceItemGet extends ItemBase {
    unit: string;
    quantity: number;
    tax: TaxGet;
    discount: number;
    discountAmount: number;
    subtotal: number;
    taxAmount: number;
    total: number;
}
export interface InvoiceItemsGet {
    '@': Type;
    item: Array<InvoiceItemGet>;
}
export declare type InvoiceStatusBase = 'finalized' | 'deleted' | 'second_copy' | 'canceled' | 'settled' | 'unsettled';
export declare type InvoiceStatusChange = InvoiceStatusBase;
export declare type InvoiceStatus = InvoiceStatusChange | 'draft' | 'final';
export declare type InvoiceType = 'Invoice' | 'CashInvoice' | 'InvoiceReceipt' | 'SimplifiedInvoice' | 'CreditNote' | 'DebitNote' | 'Receipt';
export declare type InvoiceCurrency = 'Euro';
export interface InvoiceBase {
    date: string;
    dueDate: string;
    reference?: string;
    observations?: string;
    client: Client;
    retention?: number;
}
export interface InvoiceCreateRequest extends InvoiceBase {
    taxExemption?: TaxExemption;
    sequenceId?: number;
    manualSequenceNumber?: string;
    items: InvoiceItemsCreate;
    taxRetention?: number;
    mbReference?: string;
}
export declare type InvoiceUpdateRequest = InvoiceCreateRequest & {
    invoiceId: number;
};
export interface InvoiceGetResponse extends InvoiceBase {
    id: string;
    status: InvoiceStatus;
    archived: boolean;
    type: InvoiceType;
    sequenceNumber: number;
    invertedSequenceNumber?: string;
    permalink: string;
    saftHash: string;
    currency: InvoiceCurrency;
    items: InvoiceItemsGet;
    sum: number;
    discount: number;
    beforeTaxes: number;
    taxes: number;
    total: number;
}
export interface InvoiceListQuery {
    text?: string;
    'type[]': InvoiceType;
    'status[]': InvoiceStatus;
    'date[from]'?: string;
    'date[to]'?: string;
    'dueDate[from]'?: string;
    'dueDate[to]'?: string;
    'totalBeforeTaxes[from]'?: number;
    'totalBeforeTaxes[to]'?: number;
    nonArchived?: boolean;
    archived?: boolean;
    page?: number;
    perPage?: number;
}
export declare type InvoiceListResponse = InvoiceGetResponse[];
export interface InvoiceChangeStateRequest {
    state: InvoiceStatusChange;
    message?: string;
}
export interface GeneratePdfResponse {
    pdfUrl: string;
}
export declare const invoiceUrl: {
    create: ({accountName}: {
        accountName: any;
    }) => string;
    get: ({accountName, invoiceId}: {
        accountName: any;
        invoiceId: any;
    }) => string;
    update: ({accountName, invoiceId}: {
        accountName: any;
        invoiceId: any;
    }) => string;
    listAll: ({accountName}: {
        accountName: any;
    }) => string;
    changeState: ({accountName, invoiceId}: {
        accountName: any;
        invoiceId: any;
    }) => string;
    generatePdf: ({accountName, invoiceId}: {
        accountName: any;
        invoiceId: any;
    }) => string;
};
export declare class Invoice {
    static root: string;
    static create(auth: Auth, body: InvoiceCreateRequest): Promise<InvoiceGetResponse>;
    static get(auth: Auth, invoiceId: any): Promise<InvoiceGetResponse>;
    static update(auth: Auth, body: InvoiceUpdateRequest, invoiceId: number): Promise<void>;
    static listAll(auth: Auth, query: InvoiceListQuery): Promise<InvoiceGetResponse[]>;
    static changeState(auth: Auth, body: InvoiceChangeStateRequest, invoiceId: number): Promise<void>;
    static generatePDF(auth: Auth, invoiceId: number): Promise<GeneratePdfResponse>;
}
