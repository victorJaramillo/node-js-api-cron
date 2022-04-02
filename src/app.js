const express = require('express');
const cors = require('cors');
const listEndpoints = require("express-list-endpoints");

const bodyParser = require('body-parser');

// Settings
const app = express();

app.use(cors(
    {
        origin: 'localhost:4200',
        methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
    }
));
app.set('port', process.env.NODE_PORT || 3050);
app.use(bodyParser.json());

// Middleware
app.use(require('./schedules/ipscann'));

const authRouter = require("./routes/auth");
const webhook = require('./routes/webhook');
const userRouter = require("./routes/user");
const currency_convert = require("./routes/currency-converter");
const lpapp = require('./routes/lp-app');
const product = require('./routes/product');

// Setup all the routes
app.use("/api/lp", lpapp);
app.use("/api/webhook", webhook);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", product);
app.use("/api/v1/currconv", currency_convert);

// Configurations [express server]
app.listen(app.get('port'), () => {
    console.log(`App listen on port ${app.get('port')}`);
    console.log('registered_endpoints');
    listEndpoints(app).forEach(element => {
        console.log({'path': element.path, 'methods': element.methods});
    });
});