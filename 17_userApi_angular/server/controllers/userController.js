var _ = require('underscore');

var UserModel = require('../models/user');
var userMapper = require('../mappers/userMapper');
var userRepository = require('../data/userRepository');
var HttpError = require('../httpError');

module.exports = {
    findAll : function(req, res, next){
        var query = req.query.query;
        var page = req.query.page;
        var pageSize = req.query.pageSize;
        return userRepository.findAll(query, page, pageSize, req.query.sort)
            .then(function(users) {

                // map users list to resource list
                var result = _.map(users, function(user){
                    return userMapper.map(user);
                });

                // and respond with all users (as resource)
                res.status(200).send(result);
                return null;
            })
            .catch(function(err) {
                return next(err);
            })
    },

    findOne : function(req, res, next){

        userRepository.findOne({ _id: req.params.id })
            .then(function(user) {
                if (!user)
                    return next(new HttpError(404));
                var resource = userMapper.map(user);
                res.status(200).send(resource);
            })
            .catch(function(err) {
                next(err);
            });
    },

    update : function(req, res, next){
        var resource = req.body;
        var updatedUser;
        userRepository.findOne({ _id: req.params.id})
            .then(function(user) {
                console.log('find1', user)
                if (!user)
                    return null;

                // when found, update it
                var names = resource.name.split(" ");
                user.firstName = names[0];
                user.lastName = names[1];
                user.age = resource.age;
                user.email = resource.email;
                user.homeAddress.addressLine = resource.address;
                user.homeAddress.city = resource.city;
                user.homeAddress.zip = resource.zip;

                updatedUser = user;

                return userRepository.save(user);
            })
            .then(function(user) {
                if (!user)
                    return next(new HttpError(404));

                // called after save is finished
                var resource = userMapper.map(updatedUser);
                res.status(200).send(resource);
            })
            .catch(function(err) {
                next(err);
            })
    },

    create: function(req, res, next){
        // create new user
        var resource = req.body;
        var names = resource.name.split(" ");
        var user = new UserModel({
            firstName: names[0],
            lastName: names[1],
            age: resource.age,
            email: resource.email,
            homeAddress: {
                addressLine: resource.address,
                city: resource.city,
                zip: resource.zip
            }
        });

        userRepository.save(user)
            .then(function(user) {
                // respond with new created user model
                res.set('location', 'http://localhost:3000/api/users/' + user._id);
                var resource = userMapper.map(user);
                res.status(201).send(resource);
            })
            .catch(function(err) {
                next(err);
            })
    },

    delete: function(req, res, next){

        // preferred way
        userRepository.findOne({ _id: req.params.id })
            .then(function(user) {
                if (!user) {
                    return null;
                }
                return userRepository.remove(user);
            })
            .then(function(user) {
                if (!user) {
                    res.status(204).send('no content');
                }
                var resource = userMapper.map(user);
                return res.status(200).send(resource);
            })
            .catch(function(err) {
                next(err);
            })

        // alternative
        // userRepository.findOne({ _id: req.params.id })
        //     .then(function(user) {
        //         if (!user) {
        //             throw new HttpError(204)
        //         }
        //         return userRepository.remove(user);
        //     })
        //     .then(function(user) {
        //         var resource = userMapper.map(user);
        //         return res.status(200).send(resource);
        //     })
        //     .catch(function(err) {
        //         next(err);
        //     })

    }
}
