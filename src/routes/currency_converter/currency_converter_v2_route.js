const express = require('express');
const currencyRouter = express.Router();

const utils = require('../../utils/utils.js');
const queries_util = require('../../utils/queries_util.js');

const auth = require("../../middleware/auth");

const service = require('../../services/currency_converter_service')

currencyRouter.get('/available/cl', async (req, res) => {
    const response = await utils.get_external_api(`${process.env.API_MIINDICADOR}`)
    const {data, status} = response
    const responseBody = {uf: data.uf, dollar: data.dolar, available: data}
    res.status(status).send(responseBody)
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

currencyRouter.get('/available/currencies', async (req, res) => {
    const response = await utils.get_external_api(`${process.env.LIBRE_API}/economy/currencies`)
    const {data, status} = response
    res.status(status).send(data.data)
})

module.exports = currencyRouter