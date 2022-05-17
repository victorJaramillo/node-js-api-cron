const express = require('express');
const address_service = require('../services/address_service');
const addressRouter = express.Router();


addressRouter.get('/regions', async (req, res) => {
    const response = await address_service.find_regions();
    res.send(response);
});

addressRouter.get('/regions/:id/cities', async (req, res) => {
    var { id } = req.params;
    const response = await address_service.find_cities_by_region_id(id);
    res.send(response);
});

addressRouter.get('/cities/:c_id/locations', async (req, res) => {
    var { c_id } = req.params;
    const response = await address_service.find_locations_by_city_id(c_id);
    res.send(response);

})



module.exports = addressRouter;