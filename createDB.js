 var mongoose = require('libs/mongoose');
 mongoose.set('debug', true);
 var async = require('async');
 //var User = require('./models/user').User;

 async.series([
     open,
     dropDatabase,
     requireModels,
     createUsers
     //close
 ], function (err, results) {
     console.log(arguments);
     mongoose.disconnect();
     process.exit(err ? 255: 0);
 });

function open (callback) {
    var db = mongoose.connection.on('open', callback);
}

function dropDatabase (callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}
function requireModels(callback) {
    require('models/user')
    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers (callback) {
    var users = [
        {username: 'Vasya', password: 'vasya'},
        {username: 'Petya', password: 'petya'},
        {username: 'Admin', password: 'admin'}
    ]
    async.each(users, function (userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function close (callback) {
    mongoose.disconnect(callback);
}



 // mongoose.connection.on('open', function(){
 //     var db = mongoose.connection.db;
 //     db.dropDatabase(function(err){
 //        if(err) throw err;
 //
 //         async.parallel([
 //             function(callback){
 //                 var vasya = new User({username: 'Vasya', password: 'vasya'});
 //                 //vasya.save(callback);
 //                 vasya.save( function (err) {
 //                     callback(err, vasya);
 //                 });
 //             },
 //             function(callback){
 //                 var petya = new User({username: 'Petya', password: 'petya'});
 //                 petya.save( function (err) {
 //                     callback(err, petya);
 //                 });
 //             },
 //             function(callback){
 //                 var admin = new User({username: 'Admin', password: 'admin'});
 //                 admin.save( function (err) {
 //                     callback(err, admin);
 //                 });
 //             }
 //         ], function (err, results){
 //             console.log(arguments);
 //             mongoose.disconnect();
 //         });
 //
 //        console.log('Ok');
 //
 //     });
 // })



 // var user = new User({
 //     username: "Tester11112",
 //     password: "secret"
 //
 // });
 //
 // user.save(function(err, user, affected) {
 //     if(err){
 //         throw err;
 //     }
 //     User.findOne({username: "Tester"}, function(err, tester){
 //         console.log(tester);
 //     })
 //    console.log(user);
 // });



 // var mongoose = require('mongoose');
 // var config = require('./config');
 // // var a = config.get('port');
 // mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

 // var mongoose = require('./libs/mongoose'),
 //     Schema = mongoose.Schema;





// var MongoClient = require('mongodb').MongoClient
//     , assert = require('assert');
//
// // Connection URL
// var url = 'mongodb://localhost:27017/chat';
// // Use connect method to connect to the Server
//
// var insertDocuments = function (db, callback) {
//     // Get the documents collection
//     var collection = db.collection('documents');
//
//     collection.remove({}, function(err,results){
//         if(err) throw err;
//     })
//
//     // Insert some documents
//     collection.insertMany([
//         {a : 1}, {a : 2}, {a : 3}
//     ], function(err, result) {
//         assert.equal(err, null);
//         assert.equal(3, result.result.n);
//         assert.equal(3, result.ops.length);
//         console.log("Inserted 3 documents into the document collection");
//         callback(result);
//     });
// };
//
// MongoClient.connect(url, function(err, db) {
//     assert.equal(null, err);
//     console.log("Connected correctly to server");
//     insertDocuments(db, function(){
//         var cursor = db.collection('documents').find({a:2});
//         cursor.toArray(function(err, result){
//             console.log(result);
//         })
//         db.close();
//     });
//
//
//
//
// });
//



//
// var schema = mongoose.Schema({
//     name: String
// })
//
// var Cat = mongoose.model('Cat', schema);
//
// var kitty = new Cat({ name: 'Zildjian', test: 1 });
//
// console.log(kitty);
//
// kitty.save(function (err, kitty, affected) {
//     console.log(arguments);
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('meow');
//     }
// });

