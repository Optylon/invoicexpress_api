export declare type Id = number;
export interface Auth {
    apiKey: string;
    accountName: string;
}
export interface Getter {
    apiKey: string;
    url: string;
}
export declare type SupportedLanguages = 'pt' | 'en' | 'es';
export declare enum SendOptions {
    OnlyOriginal = 1,
    OriginalAndDuplicate = 2,
    OriginalDuplicateAndTriplicate = 3,
}
export declare enum TermsAndConditions {
    NotAccepted = 0,
    Accepted = 1,
}
export interface IdBase {
    fiscalId?: string;
    email: string;
}
export interface Address {
    address?: string;
    postalCode?: string;
    city?: string;
}
export declare type TypeType = 'array';
export interface Type {
    type: TypeType;
}
export declare enum PerPage {
    PerPage10 = 10,
    PerPage20 = 20,
    PerPage30 = 30,
}
