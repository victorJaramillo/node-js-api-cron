const express = require('express');
const productRouter = express.Router();

const utils = require('../utils/utils.js');
const queries_util = require('../utils/queries_util.js');

const mysqlConnection = require('../database.js');

productRouter.get('/', async (req, res) => {
    const response = await execute_query(queries_util.get_products);
    res.send(response)
})

const execute_query = async function (sentence) {
    const response = await mysqlConnection.query(sentence);
    return response;
}

module.exports = productRouter;