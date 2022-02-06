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
    
    const values = { 'public_ip.changed_ip': 1 }

    mysqlConnection.query(utils.updated_ip_configuration(ip), values, (error, results) => {
        if (error) throw error;
        else {
            res.json({ 'message': 'updated successfully' });
        }
    })
});

routerWebHook.get('/current/public-ip', (req, res) => {
    mysqlConnection.query(utils.config_server_select, (error, results) => {
        if (error) {throw error};
        if (results.length > 0) {
            res.send(results);
        } else {
            res.send( { 'message': 'not results' });
        }
    });
});

routerWebHook.get('/current/public-ip/:ip', (req, res) => {
    const { ip } = req.params;
    mysqlConnection.query(utils.config_server_select_by_ip(ip), (error, results) => {
        if (error) {throw error};
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.send( { 'message': 'not results' });
        }
    });
});


module.exports = routerWebHook;