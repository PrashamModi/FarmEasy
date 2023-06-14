const express = require('express');
require('dotenv').config();
const dbConfig = require("./config/dbConfig")
const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

const userRoute = require('./routes/usersRoute');
const productRoute = require('./routes/productsRoute');
const bidRoute = require('./routes/bidsRoute')
const notificationsRoute = require('./routes/notificationsRoute')

app.use('/api/users', userRoute)
app.use('/api/products', productRoute);
app.use('/api/bids', bidRoute);
app.use('/api/notifications', notificationsRoute);

app.listen(port, ()=>console.log(`Listening on port ${port}`));

//deployment config
const path = require("path");
__dirname = path.resolve();
//render deployment
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/client/build")));
    app.get("*",(req, res)=>{
        res.sendFile(path.join(__dirname, "client", "build", "index.html"))
    })
}