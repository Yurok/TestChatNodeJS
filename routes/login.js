var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var async = require('async');
var AuthError = require('../models/user').AuthError;
var HttpError = require('error').HttpError;

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: '<b>LogIn</b>' });
});

router.post('/', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.autorize(username, password, function (err, user) {
        if (err) {
            if(err instanceof AuthError) {
                next( new HttpError (403, err.message));
            }
            return next(err);
        }
        req.session.user = user._id
        res.send({});
    })




    // async.waterfall([
    //     function(callback) {
    //         User.findOne({username: username}, callback);
    //     },
    //     function (user, callback) {
    //         if(user){
    //             if(user.checkPassword(password)) {
    //                 callback(null, user);
    //             } else {
    //                 next( new HttpError (403, 'Password is incorrect'));
    //             }
    //         } else {
    //             var user = new User({username: username, password: password});
    //             user.save(function(err) {
    //                 if (err) return next(err);
    //                 callback(null, user);
    //             });
    //         }
    //     }
    // ], function(err, user){
    //     if (err) return next(err);
    //     req.session.user = user._id
    //     res.send({});
    // })





    // User.findOne({username: username}, function(err, user) {
    //     if (err) return next(err);
    //     if(user){
    //         if(user.checkPassword(password)) {
    //             //.. 200
    //         } else {
    //             //403
    //         }
    //     } else {
    //         var user = new User({username: username, password: password});
    //         user.save(function(err) {
    //            if (err) return next(err);
    //             //.. 200
    //         });
    //     }
    // })
});


module.exports = router;
