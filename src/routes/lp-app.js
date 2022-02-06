const express = require('express');
const routerApis = express.Router();

const mysqlConnection = require('../database.js');

const utils = require('../utils/utils.js');


routerApis.get('/all', (req, res) => {
    const select = utils.query_lp_videos_select;
    mysqlConnection.query(select, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.json({ 'message': 'not results' });
        }
    })
});

routerApis.get('/all/:id', (req, res) => {
    var { id } = req.params;
    const select = utils.query_lp_videos_select + ` WHERE id = ${id}`;
    mysqlConnection.query(select, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({ 'message': 'not results' });
        }
    })
});

routerApis.post('/add', (req, res) => {
    const values = {
        tema_video: req.body.tema_video,
        url_video: req.body.url_video
    }
    console.log(JSON.stringify(req.body.url_video));
    mysqlConnection.query(utils.insert_lp_videos, values, (error) => {
        if (error) throw error;
        else {
            res.json({
                message: "added successfuly",
                object: req.body
            });
        }
    });
});

routerApis.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const values = {
        tema_video: req.body.tema_video,
        url_video: req.body.url_video
    }
    console.log(JSON.stringify(req.body.url_video));
    mysqlConnection.query(utils.update_lp_videos(id), values, (error) => {
        if (error) throw error;
        else {
            res.json({
                message: "updated successfuly",
                object: req.body
            });
        }
    });
});


routerApis.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    res.send(`delete => ${req}`);
});

module.exports = routerApis;