const express = require('express');
const routerWebHook = express.Router();

const utils = require('../utils/utils.js');

const mysqlConnection = require('../database.js');

const auth = require("../middleware/auth");

routerWebHook.get('/send', (req, resp) => {
    // const { number } = req.body;

    // const width = 20
    // var length = number.toString().length; /* Largo del número */
    // var zero = "0"; /* String de cero */

    // console.log(width > length);
    // if (width > length) {
    //     let response = ((zero.repeat(width - length)) + number.toString());
    //     console.log(response);
    //     resp.send(response);
    // }else {
    //     resp.send(number);
    // }

    utils.sendTextAndImageSlackNotification('PRUEBA').then((data) => {
        resp.send((data))
    });
});


routerWebHook.get('/changed/public-ip/:ip', [auth], (req, res) => {
    const { ip } = req.params;

    const values = { 'public_ip.changed_ip': 1 }

    mysqlConnection.query(utils.updated_ip_configuration(ip), values, (error, results) => {
        if (error) throw error;
        else {
            res.json({ 'message': 'updated successfully' });
        }
    })
});

routerWebHook.get('/current/public-ip', (req, res) => {
    utils.getNewPublicIp().then((x) => {
        res.send(x);
    })
});

routerWebHook.get('/current/public-ip/:ip', [auth], (req, res) => {
    const { ip } = req.params;
    mysqlConnection.query(utils.config_server_select_by_ip(ip), (error, results) => {
        if (error) { throw error };
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.send({ 'message': 'not results' });
        }
    });
});


module.exports = routerWebHook;