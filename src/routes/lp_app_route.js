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

module.exports = routerApis;