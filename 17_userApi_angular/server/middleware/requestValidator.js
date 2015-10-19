var inspector = require('schema-inspector');
var HttpError = require('../HttpError');
var _ = require('underscore');

module.exports = function validate(schema, custom) {
    return function validateRequest(req, res, next) {

        console.log(req.body);

        var resource = req.body;

        if(!schema) {
            return next();
        }

        if (_.isUndefined(custom)) {
            custom = schema.custom;
        }

        inspector.validate(schema, resource, custom, function(err, result) {
            if (!result.valid) {
                //map errors to easier structure
                console.log('error' , result);
                var errors = _.map(result.error, function(error) {
                    return {
                        key: error.property.substring(2, error.property.length),
                        message: error.message
                    };
                });
                next(new HttpError(400, errors));
            }

            //Validation success, go to next middleware
            return next();
        });
    }
}
