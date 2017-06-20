// import {
  // InvoiceExpressCountry
// , InvoiceExpressCountryCode
// } from '../../lib/country';

// brought from main project
// export type Id = string;

// export type GenericObj = { [keys: string]: any };

// Invoice Express
export interface Auth
  { apiKey      : string
  , accountName : string
  }

export interface Getter
  { apiKey: string
  , url: string
  }

export type SupportedLanguages = 'pt' | 'en' | 'es';

export enum SendOptions
  { OnlyOriginal = 1
  , OriginalAndDuplicate = 2
  , OriginalDuplicateAndTriplicate = 3
  }

export enum TermsAndConditions
  { NotAccepted = 0
  , Accepted    = 1
  }

export interface IdBase
  { fiscalId?         : string
  , email             : string
  }

export interface Address
  { address?      : string
  , postalCode?   : string
  , city?         : string
  }

// Gotta find a better name for this one
export type TypeType = 'array';

export interface Type
  { type : TypeType
  }
