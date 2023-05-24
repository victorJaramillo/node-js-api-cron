const express = require('express');
const currencyRouter = express.Router();

const utils = require('../../utils/utils.js');
const queries_util = require('../../utils/queries_util.js');

const auth = require("../../middleware/auth");

const service = require('../../services/currency_converter_service')
const { query } = require('../../database.js');

// CRON
var cron = require('node-cron');
const CURRENCY_VALUES_TIME_STACK = process.env.CURRENCY_VALUES_TIME_STACK;
const IS_PRODUCTION = JSON.parse(process.env.IS_PRODUCTION);

currencyRouter.get('/available/cl', async (req, res) => {
    task.start()
    const dollar_response = await query(queries_util.select_to_day_dollar_value)
    if(dollar_response.length >= 1) {
        const uf_response = await query(queries_util.select_to_day_uf_value)
        const data = utils.query_respose_to_json(dollar_response)[0]
        const uf_data = utils.query_respose_to_json(uf_response)[0]
        const responseBody = {uf: uf_data, dollar: data}
        res.send(responseBody)
    }else {
        const response = await get_values()
        const {data, status} = response
        const responseBody = {uf: data.uf, dollar: data.dolar, available: data}
        res.status(status).send(responseBody)
    }
    
})
currencyRouter.post('/available/cl', async (req, res) => {
    const { unit, quantity } = req.body;
    if (!unit) {

        if (unit === '' || unit === null) {
            res.status(400).send({ validation_error: "the parameter unit cannot be null or empty" })
        } else
            res.status(422).send(utils.validationBodyErrorMessage('unit'))
    }
})

const task = cron.schedule(`*/${CURRENCY_VALUES_TIME_STACK} * * * *`, async () => {
    if (IS_PRODUCTION) {
        await get_values()
        console.log(`NEW CURRENCIES VALUES excecution date ${today.toISOString()}`);
    }
})

const get_values = async () => {
    const response = await utils.get_external_api(`${process.env.API_MIINDICADOR}`)
    const values_dollar = {
        // code: response.data.dolar.codigo, 
        name: response.data.dolar.nombre,
        value: response.data.dolar.valor 
    }
    const values_uf = {
        // code: response.data.dolar.codigo, 
        name: response.data.uf.nombre,
        value: response.data.uf.valor 
    }
    await query(queries_util.insert_dollar_values, values_dollar)
    await query(queries_util.insert_uf_values, values_uf)
    return response
}

module.exports = currencyRouter