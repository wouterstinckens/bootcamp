var HttpError = require('../HttpError');

module.exports = function authorization(password) {
    return function authorization(req, res, next) {
        if (req.headers.authorization === password) {
            req.user = {
                id: 1221321,
                name: 'peter',
                role: 'admin'
            }
            return next();
        }
        next(new HttpError(401));
    }
}
