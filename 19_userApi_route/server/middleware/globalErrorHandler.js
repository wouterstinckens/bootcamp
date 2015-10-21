var HTTPStatus = require('http-status');

module.exports = function globalErrorHandler() {

    return function handler(err, req, res, next) {
        console.log('Error:', err);
        if (err.status) {
            var errorObject = {
                code: HTTPStatus[err.status],
                message: err.message
            }
            if (err.status == 400) {
                errorObject.details = err.details;
            }
            return res.status(err.status).send(errorObject);
        }

        // internal server error
        console.log(err.stack);
        res.status(500).send({
            code: HTTPStatus[500],
            message: 'Oops, something went terribly wrong at the server',
            details: err
        });
    }

}
