const express = require('express');
const routerApis = express.Router();

const mysql = require('../database.js');

const auth = require("../middleware/auth");

const utils = require('../utils/utils.js');


routerApis.get('/all', (req, res) => {
    const select = utils.query_lp_videos_select;
    mysql.mysqlConnection.query(select, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            const resp = {items: results, transaction_id: utils.UUID()}
            res.json(resp);
        } else {
            res.json({ 'message': 'not results' });
        }
    })
});

routerApis.get('/all/:id', (req, res) => {
    var { id } = req.params;
    const select = utils.query_lp_videos_select + ` WHERE id = ${id}`;
    mysql.mysqlConnection.query(select, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({ 'message': 'not results' });
        }
    })
});

routerApis.post('/add', [auth], (req, res) => {
    const values = {
        tema_video: req.body.tema_video,
        url_video: req.body.url_video
    }
    mysql.mysqlConnection.query(utils.insert_lp_videos, values, (error) => {
        if (error) throw error;
        else {
            res.send({
                message: "added successfully",
                object: req.body
            });
        }
    });
});

routerApis.put('/update/:id', [auth], (req, res) => {
    const { id } = req.params;
    const values = {
        tema_video: req.body.tema_video,
        url_video: req.body.url_video
    }
    mysql.mysqlConnection.query(utils.update_lp_videos(id), values, (error) => {
        if (error) throw error;
        else {
            res.json({
                message: "updated successfuly",
                object: req.body
            });
        }
    });
});


routerApis.delete('/delete/:id', [auth], async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    const query = `DELETE FROM url_videos_reuniones WHERE id = ${id}`
    const response = await mysql.query(query);
    res.send(response);
});

routerApis.get('/vehicles/:vehicle_id/detail', async(req, res) => {
    res.send({
        "vehicle_status_id": "383",
        "vehicle_type_id": "1237",
        "ownership": "leased",
        "name": "DemoZenner",
        "license_plate": "ZXC-701-X",
        "vin": "ABC123",
        "registration": null,
        "make": null,
        "year": null,
        "model": null,
        "group_id": null,
        "labels": [],
        "trim": null,
        "color": null,
        "body_type": null,
        "body_subtype": null,
        "msrp": null,
        "config_status": 1,
        "restriction_days": "",
        "start_time_restriction": "2021-01-11T09:56:36-06:00",
        "end_time_restriction": "2021-01-11T09:56:36-06:00",
        "load_capacity": null,
        "load_capacity_unit": null,
        "traffic_card": null,
        "is_permanent_traffic_card": false,
        "circulation_card_expiration_date": "2021-01-11",
        "inspected_type": 1,
        "inspected_value": 6,
        "cf-6075": "2021-01-30",
        "cf-6077": "d",
        "cf-6500": "Gasolina"
    })
})

module.exports = routerApis;