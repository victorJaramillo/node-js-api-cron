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

// Configurations [express server]
app.listen(app.get('port'), () => {
    console.log(`App listen on port ${app.get('port')}`);
    console.log('registered_endpoints');
    listEndpoints(app).forEach(element => {
        console.log(element);
    });
});