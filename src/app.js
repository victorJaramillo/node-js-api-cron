const express = require('express');
const os = require('os');
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

app.use(require('./schedules/ipscann'));
app.use(require('./schedules/webScaping'));

// Middleware
const authRouter = require("./routes/auth_route");
const webhook = require('./routes/webhook_route');
const userRouter = require("./routes/user_route");
const currencyConvert = require("./routes/currency_converter_route");
const currencyConvertV2 = require("./routes/currency_converter/currency_converter_v2_route");
const chileanInfo = require("./routes/chilian_info/chilean_info_route");
const lpapp = require('./routes/lp_app_route');
const product = require('./routes/product_route');
const s3minio = require('./routes/s3minio_route');
const userShopRouter = require('./routes/user_shop_router');
const addressRouter = require('./routes/address_route');
const email = require('./routes/mail_sender_router');
const moviesAndSeriesRouter = require('./routes/movies_and_series');
const enabledServicesRouter = require('./routes/server_services/enabled_services_route');

// Setup all the routes
app.use("/api/lp", lpapp);
app.use("/api/webhook", webhook);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", product);
app.use("/api/v1/currconv", currencyConvert);
app.use("/api/s3", s3minio);
app.use("/api/v1/shop/user", userShopRouter);
app.use("/api/v1/shop/address", addressRouter);
app.use("/api/v1/email", email);
app.use("/api/v1/movies-and-series", moviesAndSeriesRouter);

app.use("/api/server/enabled-services", enabledServicesRouter);
app.use("/api/v2/currconv", currencyConvertV2);
app.use("/api/v1/rut", chileanInfo);


app.use('/', async(req, res) => {
    res.status(404).send({message: 'the resource not foud', hostname: os.hostname()})
})

// Configurations [express server]
app.listen(app.get('port'), () => {
    console.log(`App listen on port ${app.get('port')}`);
    console.log('registered_endpoints');
    listEndpoints(app).forEach(element => {
        console.log({'endpoint': element.path, 'methods': element.methods});
    });
});