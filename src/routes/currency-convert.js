const express = require('express');
const currencyRouter = express.Router();

const utils = require('../utils/utils.js');
const queries_util = require('../utils/queries_util.js');

const mysqlConnection = require('../database.js');

const auth = require("../middleware/auth");

currencyRouter.post('/', [auth], async (req, res) => {
    const { unit } = req.body;
    if (!unit) {
        res.status(400);
        if (unit === '' || unit === null) {
            res.send({ validation_error: "the parameter unit cannot be null or empty" })
        } else
            res.send({ validation_error: 'the parameter unit is required in body' })
    } else {
        const { server, api_key, endpoint } = await execute_query(queries_util.get_currconv_configs);
        const api_configs = `${server}${endpoint}${api_key}`;
        const url = api_configs.replace('{coin}', unit.toUpperCase())
        const response = await utils.get_external_api(url);
        res.send(response.data);
    }
})

currencyRouter.get('/available', [auth], async (req, res) => {
    const { server, api_key, endpoint } = await execute_query(queries_util.get_available_configs);
    const url = `${server}${endpoint}${api_key}`;
    const response = await utils.get_external_api(url);
    res.send(response.data);
})

const execute_query = async function (sentence) {
    const response = await mysqlConnection.query(sentence);
    return response[0];
}

module.exports = currencyRouter