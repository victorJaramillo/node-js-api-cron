const express = require('express');
const cors = require('cors');
const listEndpoints = require("express-list-endpoints");

require('dotenv').config()

const bodyParser = require('body-parser');

// Settings
const app = express();
const fileUpload = require("express-fileupload");
const path = require("path");

app.use(cors(
    {
        origin: 'localhost:4200',
        methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
    }
));
app.set('port', process.env.NODE_PORTS);
app.use(bodyParser.json());
app.use(fileUpload());

// Middleware
app.use(require('./schedules/ipscann'));

const authRouter = require("./routes/auth");
const webhook = require('./routes/webhook');
const userRouter = require("./routes/user");
const currency_convert = require("./routes/currency-converter");
const lpapp = require('./routes/lp-app');
const product = require('./routes/product_route');
const s3minio = require('./routes/s3minio');

// Setup all the routes
app.use("/api/lp", lpapp);
app.use("/api/webhook", webhook);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", product);
app.use("/api/v1/currconv", currency_convert);
app.use("/api/s3", s3minio);

// Configurations [express server]
app.listen(app.get('port'), () => {
    console.log(`App listen on port ${app.get('port')}`);
    console.log('registered_endpoints');
    listEndpoints(app).forEach(element => {
        console.log({'path': element.path, 'methods': element.methods});
    });
});