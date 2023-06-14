const mongoose = require('mongoose');
mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;
connection.on('connected', ()=>{
    console.log("MongoDb Connected");
})

connection.on('error', (err)=>{
    console.log("Connection falied");
})

module.exports = connection;