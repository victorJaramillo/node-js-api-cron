const express = require('express');
const listEndpoints = require("express-list-endpoints");

const bodyParser = require('body-parser');

// Settings
const app = express();
app.set('port', process.env.NODE_PORT || 3050);
app.use(bodyParser.json());

// Middleware
app.use(require('./routes/lp-app'));
app.use(require('./routes/webhook'));
app.use(require('./schedules/ipscann'));

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const currency_convert = require("./routes/currency-convert");

// Setup all the routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/v1/currconv", currency_convert);

// Configurations [express server]
app.listen(app.get('port'), () => {
    console.log(`App listen on port ${app.get('port')}`);
    console.log('registered_endpoints');
    listEndpoints(app).forEach(element => {
        console.log({'path': element.path, 'methods': element.methods});
    });
});