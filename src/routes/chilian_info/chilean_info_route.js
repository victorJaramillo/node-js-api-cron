const express = require('express');
const route = express.Router();

const utils = require('../../utils/utils.js');
const queryUtils = require('../../utils/queries_util');
const {query} = require('../../database.js');

const auth = require("../../middleware/auth");

const CHILEAN_INFO = process.env.CHILEAN_INFO_API

route.post('/', async(req, res) => {
    const { rut } = req.body;
    if (!rut) {
        if (rut === '' || rut === null) {;
            res.status(400).send(utils.validationNullOrEmptyErrorMessage('rut'))
        } else
            res.status(403).send(utils.validationBodyErrorMessage('rut'))
    }else {
        const dbResponse = await query(queryUtils.get_chilean_info_by_rut(rut))
        if(!Object.keys(dbResponse).length){
            const url = `${CHILEAN_INFO}/rut/${rut}`
            const response = await utils.post_external_api(url)
            const saveObject = getObjectExternalResponse(response.data);
            query(queryUtils.save_new_chilean_info, saveObject)
            res.send(saveObject)
        }else {
            const {name, rut, gender, address, city} = dbResponse[0]
            const response = {name, rut, gender, address, city}
            res.send(response)
        }
        
    }
})

route.post('/person/search', async(req, res) => {
    const { name, lastname } = req.body;
    if (!name) {
        if (name === '' || name === null) {;
            res.status(400).send(utils.validationNullOrEmptyErrorMessage('name'))
        } else {
            res.status(403).send(utils.validationBodyErrorMessage('name'))
        }
        
    }else if (!lastname){
        if (lastname === '' || lastname === null) {;
            res.status(400).send(utils.validationNullOrEmptyErrorMessage('lastname'))
        } else {
            res.status(403).send(utils.validationBodyErrorMessage('lastname'))
        }
    } else {
        const dbResponse = await query(queryUtils.get_chilean_info_by_name_and_lastname(name, lastname))
        if(!Object.keys(dbResponse).length){
            const url = `${CHILEAN_INFO}/buscar/${name}%20${lastname}`
            const response = await utils.get_external_api(url)
            const arrSave = []
            Object.entries(response.data)[0].map(x => {
                const saveObject = getObjectExternalResponse(x);
                if(saveObject.name){
                    arrSave.push(saveObject)
                }
            })
            query(queryUtils.save_new_chilean_info, arrSave)
            res.send(arrSave)
        } else {
            const responseArr = []
            dbResponse.map(x => {
                const {name, rut, gender, address, city} = x
                const response = {name, rut, gender, address, city}
                responseArr.push(response)
            })
            res.send(responseArr)
        }
    }
})

module.exports = route

function getObjectExternalResponse(response) {
    const { Nombre, RUT, Sexo, Direccion, Ciudad } = response;
    const saveObject = { name: Nombre, rut: RUT, gender: Sexo, address: Direccion, city: Ciudad };
    return saveObject;
}
