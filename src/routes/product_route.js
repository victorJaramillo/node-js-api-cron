const express = require('express');
const productRouter = express.Router();

const utils = require('../utils/utils.js');
const queries_util = require('../utils/queries_util.js');

const mysqlConnection = require('../database.js');

productRouter.get('/', async (req, res) => {
    const response = await execute_query(queries_util.get_products);
    const ids = [];
    response.forEach(prd => {
        ids.push(prd.id);
        prd.product_image = []
    });
    const image_response = await execute_query(queries_util.get_products_images(ids));
    response.forEach(prd => {
        prd.product_image.push(image_response.find(x => x.product_id === prd.id));
    })
    
    res.send(response)
})

const execute_query = async function (sentence) {
    const response = await mysqlConnection.query(sentence);
    return response;
}

module.exports = productRouter;