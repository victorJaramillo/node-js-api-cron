const express = require('express');
const routerApis = express.Router();

const mysqlConnection = require('../database.js');

const query_select = 'select * from url_videos_reuniones';

routerApis.get('/all', (req, res) => {
    const select = query_select;
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
    const select = query_select + ` where id = ${id}`;
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
    const insert = `INSERT INTO url_videos_reuniones SET ?`;

    const values = {
        tema_video: req.body.tema_video,
        url_video: req.body.url_video
    }
    console.log(JSON.stringify(req.body.url_video));
    mysqlConnection.query(insert, values, (error) => {
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
    const update = `UPDATE url_videos_reuniones SET ? WHERE id = ${id}`;
    const values = {
        tema_video: req.body.tema_video,
        url_video: req.body.url_video
    }
    console.log(JSON.stringify(req.body.url_video));
    mysqlConnection.query(update, values, (error) => {
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