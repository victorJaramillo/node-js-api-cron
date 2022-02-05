const express = require('express');
const routerWebHook = express.Router();
const axios = require('axios');

const utils = require('../utils/utils.js');

const mysqlConnection = require('../database.js');

routerWebHook.get('/webhook', (req, resp) => {
    utils.getNewPublicIp().then((x) => {
        resp.send(x);
    });
});

routerWebHook.get('/changed/public-ip/:ip', (req, res) => {
    const { ip } = req.params;
    const updated_ip_configuration = `UPDATE server_config.public_ip SET ? WHERE public_ip = '${ip}'`
    const values = { 'public_ip.changed_ip': 1 }

    mysqlConnection.query(updated_ip_configuration, values, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.json({ 'message': 'not results' });
        }
    })
});

routerWebHook.get('/current/public-ip', (req, res) => {
    console.log('entré en el query');
    mysqlConnection.query(utils.config_server_select, (error, results) => {
        if (error) {throw error};
        if (results.length > 0) {
            return results;
        } else {
            return { 'message': 'not results' };
        }
    });
});


module.exports = routerWebHook;