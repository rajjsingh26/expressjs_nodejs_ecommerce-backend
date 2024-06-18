const express = require('express');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// cookies and file upload middlware
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:'/tmp/'
}))

//regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// morgan middleware
app.use(morgan("tiny"));

// import all routes here 
const home = require('./routes/home.js')
const user = require('./routes/userRoutes.js')
const product = require('./routes/product.js')
const order = require('./routes/order.js')

// router middleware
app.use('/api/v1',home) // at single place we can change the api version 
app.use('/api/v1',user)
app.use('/api/v1',product)
app.use('/api/v1',order)

// export app js
module.exports = app;