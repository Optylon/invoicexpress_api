import { Auth } from '../sharedInterfaces';
import { InvoiceCreateRequest, InvoiceGetResponse, InvoiceListQuery, InvoiceChangeStateRequest, InvoiceUpdateRequest, GeneratePdfResponse } from '../invoice';
export declare const invoiceReceiptUrl: {
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
    changeStatus: ({accountName, invoiceId}: {
        accountName: any;
        invoiceId: any;
    }) => string;
    generatePdf: ({accountName, invoiceId}: {
        accountName: any;
        invoiceId: any;
    }) => string;
};
export declare class InvoiceReceipt {
    static root: string;
    static create(auth: Auth, body: InvoiceCreateRequest): Promise<InvoiceGetResponse>;
    static get(auth: Auth, invoiceId: any): Promise<InvoiceGetResponse>;
    static update(auth: Auth, body: InvoiceUpdateRequest, invoiceId: number): Promise<void>;
    static listAll(auth: Auth, query: InvoiceListQuery): Promise<InvoiceGetResponse[]>;
    static changeState(auth: Auth, body: InvoiceChangeStateRequest, invoiceId: number): Promise<void>;
    static generatePDF(auth: Auth, invoiceId: number): Promise<GeneratePdfResponse>;
}
