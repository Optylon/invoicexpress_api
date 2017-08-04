import { Auth } from '../sharedInterfaces';
export interface SequenceCreateRequest {
    serie: string;
    defaultSequence?: number;
}
export interface SequenceGetResponse {
    id: number;
    serie: string;
    defaultSequence: number;
    currentInvoiceNumber: number;
    currentInvoiceSequenceId: number;
    currentInvoiceReceiptNumber: number;
    currentInvoiceReceiptSequenceId: number;
    currentSimplifiedInvoiceNumber: number;
    currentSimplifiedInvoiceSequenceId: number;
    currentCreditNoteNumber: number;
    currentCreditNoteSequenceId: number;
    currentDebitNoteNumber: number;
    currentDebitNoteSequenceId: number;
    currentReceiptNumber: number;
    currentReceiptSequenceId: number;
    currentShippingNumber: number;
    currentShippingSequenceId: number;
    currentTransportNumber: number;
    currentTransportSequenceId: number;
    currentDevolutionNumber: number;
    currentDevolutionSequenceId: number;
    currentProformaNumber: number;
    currentProformaSequenceId: number;
    currentQuoteNumber: number;
    currentQuoteSequenceId: number;
    currentFeesNoteNumber: number;
    currentFeesNoteSequenceId: number;
}
export declare const sequenceUrl: {
    create: ({accountName}: {
        accountName: any;
    }) => string;
    get: ({accountName, sequenceId}: {
        accountName: any;
        sequenceId: any;
    }) => string;
    update: ({accountName, sequenceId}: {
        accountName: any;
        sequenceId: any;
    }) => string;
    listAll: ({accountName}: {
        accountName: any;
    }) => string;
};
export declare class Sequence {
    static root: string;
    static create(auth: Auth, body: SequenceCreateRequest): Promise<SequenceGetResponse>;
    static get(auth: Auth, sequenceId: number): Promise<SequenceGetResponse>;
    static update(auth: Auth, sequenceId: number): Promise<SequenceGetResponse>;
    static listAll(auth: Auth): Promise<Array<SequenceGetResponse>>;
}
