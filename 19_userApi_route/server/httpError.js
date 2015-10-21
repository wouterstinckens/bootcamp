function HttpError(status, details, message) {
    var temp = Error.call(this, message);
    temp.name = this.name = 'HttpError';
    this.stack = temp.stack;
    this.message = temp.message;
    this.status = status;
    this.details = details;
    if (!message) {
        switch (this.status ) {
            case 404: this.message = 'The resource is not found'; break;
            case 401: this.message = 'The request is not authorized'; break;
            case 403: this.message = 'The requesting identity may not access this resource'; break;
            case 400: this.message = 'One or more errors occured'; break;
            case 500: this.message = 'Not good, something went terribly wrong at the server'; break;
            default: this.message = 'Oops, we have a problem'
        }
    }
}

//inherit prototype using ECMAScript 5 (IE 9+)
HttpError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: HttpError,
        writable: true,
        configurable: true
    }
});

module.exports = HttpError;
