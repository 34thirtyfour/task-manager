const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error,client) => {
    if(error){
        return console.log('Unable to connect to database');
    }
    const db = client.db(databaseName);
    /*db.collection('users').insertOne({
        name:'Harvinder Singh',
        age:27
    });*/

    db.collection('users').insertMany([
        { name: 'Gourav', age: 20},
        { name: 'Kartik', age: 21},
        { name: 'Niharika', age: 22}
    ]).then(function(){
        console.log("Data inserted")  // Success
    }).catch(function(error){
        console.log(error)      // Failure
    });


    
})