import { Auth } from '../sharedInterfaces';
export declare type Region = 'PT' | 'PT-AC' | 'PT-MA' | 'Desconhecido';
export interface TaxCreateRequest {
    name: string;
    value: number;
    region: Region;
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
