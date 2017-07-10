/* tslint:disable:max-line-length */
// we're not using classes because babel support is not good

export function InvalidInvoiceXpressAPIKey(addMsg?) {
  this.message = 'Invalid API key provided to InvoiceXpress:' + (addMsg ? addMsg : '');
  this.name = 'InvalidInvoiceXpressAPIKey';
  Error.captureStackTrace(this, InvalidInvoiceXpressAPIKey);
}
InvalidInvoiceXpressAPIKey.prototype = Object.create(Error.prototype);
InvalidInvoiceXpressAPIKey.prototype.constructor = InvalidInvoiceXpressAPIKey;

export function InvoiceXpressElementAlreadyExists(addMsg?) {
  this.message = 'InvoiceXpress element already exists:' + (addMsg ? addMsg : '');
  this.name = 'InvoiceXpressElementAlreadyExists';
  Error.captureStackTrace(this, InvoiceXpressElementAlreadyExists);
}
InvoiceXpressElementAlreadyExists.prototype = Object.create(Error.prototype);
InvoiceXpressElementAlreadyExists.prototype.constructor = InvoiceXpressElementAlreadyExists;

export function InvoiceXpressInvalidName(addMsg?) {
  this.message = 'InvoiceXpress invalid name provided to identifier:' + (addMsg ? addMsg : '');
  this.name = 'InvoiceXpressInvalidName';
  Error.captureStackTrace(this, InvoiceXpressInvalidName);
}
InvoiceXpressInvalidName.prototype = Object.create(Error.prototype);
InvoiceXpressInvalidName.prototype.constructor = InvoiceXpressInvalidName;

export function InvoiceXpressUnexpectedError(addMsg?) {
  this.message = 'InvoiceXpress unexpected error:' + (addMsg ? addMsg : '');
  this.name = 'InvoiceXpressUnexpectedError';
  Error.captureStackTrace(this, InvoiceXpressUnexpectedError);
}
InvoiceXpressUnexpectedError.prototype = Object.create(Error.prototype);
InvoiceXpressUnexpectedError.prototype.constructor = InvoiceXpressUnexpectedError;

export function InvoiceXpressInvalidId(addMsg?) {
  this.message = 'InvoiceXpress invalid id provided:' + (addMsg ? addMsg : '');
  this.name = 'InvoiceXpressInvalidId';
  Error.captureStackTrace(this, InvoiceXpressInvalidId);
}
InvoiceXpressInvalidId.prototype = Object.create(Error.prototype);
InvoiceXpressInvalidId.prototype.constructor = InvoiceXpressInvalidId;
