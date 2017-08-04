"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// import {
// InvoiceExpressCountry
// , InvoiceExpressCountryCode
// } from '../../lib/country';
var SendOptions = exports.SendOptions = undefined;
(function (SendOptions) {
    SendOptions[SendOptions["OnlyOriginal"] = 1] = "OnlyOriginal";
    SendOptions[SendOptions["OriginalAndDuplicate"] = 2] = "OriginalAndDuplicate";
    SendOptions[SendOptions["OriginalDuplicateAndTriplicate"] = 3] = "OriginalDuplicateAndTriplicate";
})(SendOptions || (exports.SendOptions = SendOptions = {}));
var TermsAndConditions = exports.TermsAndConditions = undefined;
(function (TermsAndConditions) {
    TermsAndConditions[TermsAndConditions["NotAccepted"] = 0] = "NotAccepted";
    TermsAndConditions[TermsAndConditions["Accepted"] = 1] = "Accepted";
})(TermsAndConditions || (exports.TermsAndConditions = TermsAndConditions = {}));
var PerPage = exports.PerPage = undefined;
(function (PerPage) {
    PerPage[PerPage["PerPage10"] = 10] = "PerPage10";
    PerPage[PerPage["PerPage20"] = 20] = "PerPage20";
    PerPage[PerPage["PerPage30"] = 30] = "PerPage30";
})(PerPage || (exports.PerPage = PerPage = {}));
//# sourceMappingURL=sharedInterfaces.js.map
