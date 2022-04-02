const express = require('express');
const productRouter = express.Router();

const utils = require('../utils/utils.js');
const queries_util = require('../utils/queries_util.js');

const mysqlConnection = require('../database.js');

productRouter.get('/', (req, res) => {
    res.send([])
})

module.exports = productRouter;