const express = require('express');
const routerApis = express.Router();

const {query} = require('../database.js');

const auth_apikey = require("../middleware/auth_api_key");


const queries = require('../utils/queries_util.js');
const utils = require('../utils/utils');


routerApis.post('/',[auth_apikey], async(req, res) => {
    const body = req.body;
    if(!Object.keys(body).length) {
        res.status(400).send({message: "body is required"})
    }else if(!body.serie_name || !body.season || !body.url){
        res.status(400).send({message: "the body is incomplete. parameters are required"})
    }
    else {
        const findDuplicated = await query(queries.select_series_where_name(body.serie_name))
        if(!Object.keys(findDuplicated).length){
            const values = {
                serie_name: req.body.serie_name,
                season: req.body.season
            }
            const response = await query(queries.save_new_serie, values)
            const urlValues = {
                id_serie: response.insertId,
                url: req.body.url
            }
            await query(queries.save_new_serie_url, urlValues)
            res.status(201).send({message: "successfully created"});
        } else {
            res.status(400).send({message: "record already exists"});
        }
    }

})

routerApis.get('/',[auth_apikey], async(req, res) => {
    const seriesUrlresponse = await query(queries.select_series_url);
    let id_series = []
    let response = []
    seriesUrlresponse.map((x) =>{
        id_series.push(x.id_serie);
    })
    const series_response = await query(queries.select_series_where_ids(id_series))

    series_response.map((x) => {
        const data = seriesUrlresponse.find(ele => ele.id_serie == x.id)
        response.push({id: data.id, name: x.serie_name, season: x.season,url: data.url})
    })
    res.send(response);
})

routerApis.get('/:id',[auth_apikey], async(req, res) => {
    const {id} = req.params
    const seriesUrlresponse = await query(queries.select_series_url_by_id(id));
    let id_series = []
    let response = {}
    seriesUrlresponse.map((x) =>{
        id_series.push(x.id_serie);
    })
    if(id_series.length > 0) {
        const series_response = await query(queries.select_series_where_ids(id_series))
    
        series_response.map((x) => {
            const data = seriesUrlresponse.find(ele => ele.id_serie == x.id)
            response = {id: data.id, name: x.serie_name, season: x.season,url: data.url}
        })
        res.send(response);
    } else {
        res.status(404).send({});
    }
})

routerApis.delete('/:id',[auth_apikey], async(req, res) => {
    const {id} = req.params
    var seriesUrlresponse = await query(queries.select_series_url_by_id(id));
    seriesUrlresponse = utils.query_respose_to_json(seriesUrlresponse)
    if(seriesUrlresponse[0]){
        const {id_serie}= seriesUrlresponse[0]
        var deletedSerieUrl = await query(queries.delete_serie_or_movie(id));
        await query(queries.delete_serie_or_movie_name(id_serie));
        deletedSerieUrl = utils.query_respose_to_json(deletedSerieUrl)

        const {affectedRows} = deletedSerieUrl
        if(Boolean(affectedRows)){
            res.send({message: 'field successfully removed'});
        }    
    }
    else {
        res.status(403).send({message: 'no field removed'});
    }
})

module.exports = routerApis;