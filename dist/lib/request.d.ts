import { Publisher } from './api/util';
export declare const publisher: ({method, apiKey, body, url, root}: Publisher) => any;
export declare const getter: ({apiKey, url}: {
    apiKey: any;
    url: any;
}) => any;
export declare function getErrorString(errr: any): any;
