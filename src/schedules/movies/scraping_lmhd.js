const express = require('express');
const router = express.Router();
const queryUtils = require('../../utils/queries_util');
const utils = require('../../utils/utils.js');
const { query } = require('../../database.js');
var cron = require('node-cron');

const auth_apikey = require("../../middleware/auth_api_key");

const WEB_SCRAPING_TIME_STACK = process.env.WEB_SCRAPING_TIME_STACK;
const IS_PRODUCTION = JSON.parse(process.env.IS_PRODUCTION);


const request = require('request-promise');
const cheerio = require('cheerio');

router.get('/start', [auth_apikey], async (req, res) => {
    task.start();
    res.send(response)
})

router.post('/', [auth_apikey], async (req, res) => {
    await scraping_series('https://avohdlinks.latinomegahd.net/?v=GEZ')
    res.send({message: 'OK'})
});

const scraping_series = async (url) => {
    try {
        const $ = await request({
            uri: url,
            transform: body => cheerio.load(body)
        })

        console.log($.html());
    }catch (error) {
        console.log(error);
        return error
    }
}    

module.exports = router