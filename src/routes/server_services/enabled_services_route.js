const express = require('express');
const router = express.Router();
const service = require('../../services/server_services/server_service')

const auth = require("../../middleware/auth")

router.get('/', async(req, res) => {
    const response = await service.find_all_enabled_services();
    res.send(response)
})
router.post('/', [auth], async(req, res) => {
    const body = {service_name: req.body.service_name}
    const response = await service.saveNewEnabledService(body)
    res.status(201).send(response)
})

router.get('/:id', [auth], async(req, res) => {
    var {id} = req.params
    const response = await service.find_all_enabled_services_by_id(id);
    res.send(response)
})

router.delete('/:id', [auth], async(req, res) => {
    var {id} = req.params
    const response = await service.deleteServiceByIds(id);
    res.send(response)
})

module.exports = router;