export declare const writeFile: (fn: string, data: any) => Promise<void>;
/** Convert from Invoice Express XML format */
export declare const fromXml: (xml: any) => Promise<any>;
/** Convert to Invoice Express XML format */
export declare const toXml: (root: any, body: any) => string;
