import { Auth } from '../sharedInterfaces';
export interface TaxCreateRequest {
    name: string;
    value: number;
}
export interface TaxCreateResponse extends TaxCreateRequest {
    id: number;
}
export declare const taxUrl: {
    create: ({accountName}: {
        accountName: any;
    }) => string;
};
export declare class Tax {
    static root: string;
    static create(auth: Auth, body: TaxCreateRequest): Promise<TaxCreateResponse>;
}
