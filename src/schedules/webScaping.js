var cron = require('node-cron');
const express = require('express');
const router = express.Router();
const queryUtils = require('../utils/queries_util.js');
const utils = require('../utils/utils.js');
const { mysqlConnection, query } = require('../database.js');

const WEB_SCRAPING_TIME_STACK = process.env.WEB_SCRAPING_TIME_STACK;
const IS_PRODUCTION = process.env.IS_PRODUCTION;

const request = require('request-promise');
const cheerio = require('cheerio');

router.get('/scraping', async (req, res) => {
    task.start();
    const resp = await scraping_cuevana_movies()
    res.send({ message: 'Ok', resp })
});

const task = cron.schedule(`*/${WEB_SCRAPING_TIME_STACK} * * * *`, () => {
    console.log(`running a Web Scraping task every ${WEB_SCRAPING_TIME_STACK} minutes`);
    scraping_cuevana_movies()
    console.log(`Web Scraping excecution date ${today.toISOString()}`);
})

const scraping_cuevana_movies = async () => {
    console.log(`running a Web Scraping task every ${WEB_SCRAPING_TIME_STACK} minutes`);
    try {
        const $ = await request({
            uri: 'https://cuevana3.rip/',
            transform: body => cheerio.load(body)
        });
        var respArray = []
        $('.TpRwCont .apt ul li').each((i, ele) => {
            const image = $(ele).find('.Image .Objf');
            // console.log($(image).html());

            var asd = $(image).html();
            asd = utils.urlSrcFromStrHtml(asd);

            const content = $(ele).find('.TPMvCn p');

            var title = $(ele).find('h2');
            title = $(title).html();

            var desc = $(ele).find('.Description p');
            desc = $(desc).html();

            var vote = $(content).find('.Vote');
            vote = $(vote).html();

            var time = $(content).find('.Time');
            time = $(time).html();

            var date = $(content).find('.Date');
            date = $(date).html();

            var qlty = $(content).find('.Qlty');
            qlty = $(qlty).html();


            respArray.push({ title, desc, vote, time, date, qlty, asd })
        })
        respArray.map(el => {
            const vote = Number.parseInt(el.vote)
            mysqlConnection.query(queryUtils.select_scraper_movies(el.title, el.date), (err, result) => {
                if (!result[0]) {
                    if (el.date === '2022' && vote >= 5) {
                        console.log(el.title, el.desc, el.date, '', el.qlty);
                        utils.sendTextAndImageSlackNotification(el.title, el.desc, el.date, el.qlty, el.asd[0],el.vote).then((data) => {
                            console.log(data);
                        });
                        delete el.asd
                        mysqlConnection.query(queryUtils.save_scraper_movies, el, (err) => {
                            if (err) console.log(err)
                            else {
                                console.log({ message: 'saved', el });
                            }
                        })
                    }
                }
            })
        })
        return respArray
    } catch (error) {
        console.log(error);
        return error
    }
}

module.exports = router