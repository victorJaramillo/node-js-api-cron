const express = require('express');
const productRouter = express.Router();

const utils = require('../utils/utils.js');
const queries_util = require('../utils/queries_util.js');

const mysqlConnection = require('../database.js');
const service = require('../services/product_shop_service.js');


productRouter.get('/', async (req, res) => {
    const response = await service.get_products();
    if(response){
        res.send(response)
    }else {
        res.send({})
    }
})

productRouter.get('/:id', async (req, res) => {
    var { id } = req.params;
    const response = await execute_query(queries_util.get_product_by_id(id));
    if(response){
        const ids = []
        ids.push(id);
        const image_response = await execute_query(queries_util.get_products_images(ids));
        response[0].product_image = [];
        response[0].enable = Boolean(Number.parseInt(response[0].enable))
        image_response.forEach( x => {
            response[0].product_image.push(x)
        })
        res.send(response[0]);
    }
})

const execute_query = async function (sentence) {
    const response = await mysqlConnection.query(sentence);
    return response;
}

module.exports = productRouter;