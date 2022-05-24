const express = require('express');
const productRouter = express.Router();
const service = require('../services/shop/product_shop_service.js');


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
    const response = await service.update_product(req.body);
    res.send(response)
})

productRouter.post('/', async (req, res) => {
    const response = await service.create_product(req.body);
    res.send(response)
})

module.exports = productRouter;