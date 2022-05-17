const express = require('express');
const productRouter = express.Router();
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
    const response = await service.get_product_by_id(id)
    if(response){
        res.send(response);
    }else {
        res.send({})
    }
})

productRouter.put('/', async (req, res) => {
    console.log('req => ', req.body);
    res.send({})
})


module.exports = productRouter;