var log = require('libs/log')(module);
var config = require('../config');
var connect = require('connect');
var async = require('async');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var sessionStore = require('../libs/sessionStore');
var HttpError = require('../error').HttpError;
var User = require('../models/user').User;

// callback(null, session)
// callback(null, null)
// callback(err)
function loadSession(sid, callback) {
    sessionStore.load(sid, function (err,session) {
        if(arguments.length == 0) {
            // no arguments = > no session
            return callback(null, null);
        } else {
            callback(null, session);
        }
    });
}

function loadUser(session, callback) {
    if(!session.user) {
        log.debug("Session %s is anonymous", session.id);
    }

    log.debug("retrieving user", session.id);

    User.findById(session.user, function(err, user) {
        if (err) return callback(err);

        if(!user) {
            return callback(null, null);
        }
        log.debug("user findbyId result: ", user);
        callback(null, user);
    });

}

module.exports = function (server) {
    var io = require('socket.io').listen(server);

    io.set('origins', 'localhost:*');
    io.set('logger', log);

    io.use(function(socket, next) {
        // var handshakeData = socket.request;
        // // make sure the handshake data looks good as before
        // // if error do this:
        // // next(new Error('not authorized');
        // // else just call next
        // next();



        //var handshakeData = socket.request;
        var handshakeData = socket.handshake;

        async.waterfall([
            function (callback) {
                handshakeData.cookies = cookie.parse(handshakeData.headers.cookie || '');
                var sidCookie = handshakeData.cookies[config.get('session:key')];
                var sessionSecret = config.get('session:secret');
                //var sid = connect.utils.parseSignedCookie(sidCookie, sessionSecret);
                var sid = cookieParser.signedCookie(sidCookie, sessionSecret);

                loadSession(sid, callback);
            },
            function(session, callback) {
                if(!session) {
                    callback(new HttpError(401, "No session"));
                }
                handshakeData.session = session;
                loadUser(session, callback);
            },
            function(user, callback) {
                if(!user) {
                    callback(new HttpError(403, "Anonymous session may not connect"));
                }

                handshakeData.user = user;
                callback(null);
            }
        ], function(err){
            if(!err){
                return next();
            }
            if(err instanceof HttpError){
                return next(404);
            }
            next(err);
        })
    });

    io.on('session:reload', function(sid) {
        var clients = io.clients();
        clients.forEach(function (client) {

            //var handshakeData = socket.request;
            var handshakeData = socket.handshake;

            if(handshakeData.session.id != sid) return;

            loadSession(sid, function (err, session) {
                if(err) {
                    client.emit("error", "server error");
                    client.disconnect();
                    return;
                }

                if(!session) {
                    client.emit("logout");
                    client.disconnect();
                    return;
                }

                handshakeData.session = session;
            });

        })
    });

    io.on('connection', function(socket){
        console.log('a user connected');
        //socket.emit('news', { hello: 'world' });

        //var handshakeData = socket.request;
        var handshakeData = socket.handshake;

        var username = handshakeData.user.get('username');
        socket.broadcast.emit('join', username);

        socket.on('message', function(text, callback){
            socket.broadcast.emit('message', username, text);
            callback && callback();
        });

        socket.on('disconnect', function(){
            socket.broadcast.emit('leave', username);
        });
    });

    return io;
};
