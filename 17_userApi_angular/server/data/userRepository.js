var Q = require('q');
var UserModel = require('../models/user');

module.exports = {
    findAll: function(query, page, pageSize, sort) {
        var deferred = Q.defer();
        var pageSize = pageSize || 100;
        var page = page || 0;
        UserModel.find(query)
            .limit(pageSize)
            .skip(pageSize * page)
            .sort(sort)
            .exec(function(err, users) {
                if (err)
                    return deferred.reject(err);
                deferred.resolve(users);
            });
        return deferred.promise;
    },

    findOne: function(query) {
        var deferred = Q.defer();
        UserModel.findOne(query, function(err, user) {
            console.log('findone', user)
            if (err)
                return deferred.resolve(null);
            deferred.resolve(user);
        });

        return deferred.promise;
    },

    save: function(model) {
        console.log('save', model)
        var deferred = Q.defer();
        model.save(function(err, user) {
            if (err)
                return deferred.reject(err);
            deferred.resolve(user);
        })
        return deferred.promise;
    },

    remove: function(model) {
        var deferred = Q.defer();
        model.remove(function(err, user) {
            if (err)
                return deferred.reject(err);
            deferred.resolve(user);
        })
        return deferred.promise;
    }
}
