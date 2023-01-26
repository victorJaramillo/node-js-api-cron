var cron = require('node-cron');
const express = require('express');
const router = express.Router();
const queryUtils = require('../utils/queries_util.js');
const utils = require('../utils/utils.js');
const { mysqlConnection, query } = require('../database.js');

const WEB_SCRAPING_TIME_STACK = process.env.WEB_SCRAPING_TIME_STACK;
const IS_PRODUCTION = JSON.parse(process.env.IS_PRODUCTION);

const request = require('request-promise');
const cheerio = require('cheerio');

router.get('/scraping', async (req, res) => {
    task.start();
    await Promise.all(
        [
            scraping_cuevana_movies(), 
            scraping_pelis_panda(),
            scraping_cuevana_la_periferia()
        ]
    );
    res.send({ message: 'Ok' })
});

const task = cron.schedule(`*/${WEB_SCRAPING_TIME_STACK} * * * *`, () => {
    console.log(`running a Web Scraping task every ${WEB_SCRAPING_TIME_STACK} minutes`);
    console.log('Is production process? => ',IS_PRODUCTION);
    if(IS_PRODUCTION){
        scraping_cuevana_movies()
        scraping_pelis_panda()
    }
    console.log(`Web Scraping excecution date ${today.toISOString()}`);
})

const scraping_cuevana_movies = async () => {
    console.log(`running a Web Scraping task every ${WEB_SCRAPING_TIME_STACK} minutes`);
    try {
        const $ = await request({
            uri: 'https://cuevana3.be/inicio',
            transform: body => cheerio.load(body)
        });
        var respArray = []
        $('.slider .bd .apt ul li').each((i, ele) => {
            const image = $(ele).find('.Image .Objf');

            var image_arr = $(image).html();
            image_arr = utils.urlSrcFromStrHtml(image);

            const content = $(ele).find('.TPMvCn p');

            var title = $(ele).find('h2');
            title = $(title).html();

            var desc = $(ele).find('.Description p').next();
            desc = $(desc).html();

            var vote = $(content).find('.Vote');
            vote = $(vote).html();

            var time = $(content).find('.Time');
            time = $(time).html();

            var date = $(content).find('.Date');
            date = $(date).html();

            var qlty = $(content).find('.Qlty');
            qlty = $(qlty).html();

            // <a href="">
            var href = []
            $(ele).find('.TPost a[href]').each((index, elem) => {
                href.push($(elem).attr('href'))
            });
            href = href[0]

            respArray.push({ title, desc, vote, time, date, qlty, image_arr, href })
        })
        respArray.map(el => {
            const vote = Number.parseInt(el.vote)
            mysqlConnection.query(queryUtils.select_scraper_movies(el.title, el.date), (err, result) => {
                if (undefined != result && !result[0]) {
                    const years = ['2021','2022','2023']
                    if ((years.includes(el.date)) && (vote >= 3)) {
                        utils.sendTextAndImageSlackNotification('[** CUEVANA **] ' + el.title, el.desc, el.date, el.qlty, el.image_arr[0], el.vote, el.href)
                        const objToSave = { title: el.title, desc: el.desc, vote: el.vote, time: el.time, date: el.date, qlty: el.qlty, link: el.href }
                        mysqlConnection.query(queryUtils.save_scraper_movies, objToSave, (err) => {
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

const scraping_pelis_panda = async () => {
    try {
        const $ = await request({
            uri: 'https://pelispanda.com/peliculas/',
            transform: body => cheerio.load(body)
        });

        var pelisArr = []
        $('.catalog .container .row').each((i, row) => {
            $(row).find('.card ').each((i, values) => {
                const ahref = $(values).find('.card__title a[href]')
                const title = $(values).find('.card__title')
                const quality = $(values).find('.card__list')
                const vote = $(values).find('.card__content .card__rate')
                const image = $(values).find('.card__cover img[data-src]')

                pelisArr.push(
                    {
                        title: $(title).text().replaceAll("'", ""),
                        url: $(ahref).attr('href'),
                        quality: $(quality).text().replaceAll('\n', ''),
                        vote: Number.parseInt($(vote).text()),
                        image: $(image).attr('data-src')
                    }
                )
            })
        });
        pelisArr.map((data) => {
            mysqlConnection.query(queryUtils.select_scraper_pelis_panda(data.title, data.url), (err, result) => {
                if (result && !result[0]) {
                    if (data.vote >= 5) {

                        mysqlConnection.query(queryUtils.save_scraper_pelis_panda, data, (err) => {
                            if (err) console.log(err)
                            else {
                                utils.sendTextAndImageSlackNotification('[** PELIS_PANDA **] ' + data.title, 'N/A', 'N/A', data.quality, data.image, data.vote, data.url)
                            }
                        })
                    }
                }
            })
        })


    } catch (error) {
        console.log(error);
    }
}

const scraping_cuevana_house_of_the_dragons = async () => {
    console.log(`running a Web Scraping task every ${WEB_SCRAPING_TIME_STACK} minutes`);
    try {
        const $ = await request({
            uri: 'https://ww1.cuevana3.me/serie/house-of-the-dragon',
            transform: body => cheerio.load(body)
        });
        var respArray = []
        $('.TpRwCont ul li').each((i, ele) => {
            const image = $(ele).find('.Image .Objf');

            var image_arr = $(image).html();
            image_arr = 'https:' + utils.urlSrcFromStrHtml(image);

            var chapter = $(ele).find('.Image .Year');
            chapter = $(chapter).html();

            var title = $(ele).find('h2');
            title = $(title).html();

            var premiere_date = $(ele).find('.TPost p');
            premiere_date = $(premiere_date).html();

            // <a href="">
            var href = []
            $(ele).find('.TPost a[href]').each((index, elem) => {
                href.push($(elem).attr('href'))
            });
            href = href[0]
            if(title && title.includes('House of the Dragon')){
                if(respArray.length == 0 ){
                    respArray.push({ title, premiere_date, chapter, image_arr, href })
                }else {
                    const exist = respArray.find(ele => {
                        if(ele.chapter === chapter){
                            return true;
                        }
                        return false;
                    })
                    if(!exist)
                    respArray.push({ title, premiere_date, chapter, image_arr, href })
                }
            }
    })
        respArray.map(el => {
            mysqlConnection.query(queryUtils.select_scraper_serie_cuevana(el.title, el.chapter), (err, result) => {
                if (!result[0]) {
                    const objToSave = { title: el.title, premiere_date: el.premiere_date, chapter: el.chapter, img_url: el.image_arr, link: el.href }
                    mysqlConnection.query(queryUtils.save_scraper_serie_cuevana, objToSave, (err) => {
                        if (err) console.log(err)
                        else {
                            console.log({ message: 'saved', el })
                            utils.sendTextAndImageSlackNotification('[** CUEVANA **] ' + el.title, 'N/A', el.premiere_date, 'N/A', el.image_arr, 'N/A', el.href)
                        }
                    })
                }
            })
        })
        return respArray
    } catch (error) {
        console.log(error);
        return error
    }
}
const scraping_cuevana_the_lord_of_the_rings = async () => {
    console.log(`running a Web Scraping task every ${WEB_SCRAPING_TIME_STACK} minutes`);
    try {
        const $ = await request({
            uri: 'https://ww1.cuevana3.me/serie/the-lord-of-the-rings-the-rings-of-power',
            transform: body => cheerio.load(body)
        });
        var respArray = []
        $('.TpRwCont ul li').each((i, ele) => {
            const image = $(ele).find('.Image .Objf');

            var image_arr = $(image).html();
            image_arr = 'https:' + utils.urlSrcFromStrHtml(image);

            var chapter = $(ele).find('.Image .Year');
            chapter = $(chapter).html();

            var title = $(ele).find('h2');
            title = $(title).html();

            var premiere_date = $(ele).find('.TPost p');
            premiere_date = $(premiere_date).html();

            // <a href="">
            var href = []
            $(ele).find('.TPost a[href]').each((index, elem) => {
                href.push($(elem).attr('href'))
            });
            href = href[0]
            if (title && title.includes('The Lord of the Rings')) {
                if (respArray.length == 0) {
                    respArray.push({ title, premiere_date, chapter, image_arr, href })
                } else {
                    const exist = respArray.find(ele => {
                        if (ele.chapter === chapter) {
                            return true;
                        }
                        return false;
                    })
                    if (!exist)
                        respArray.push({ title, premiere_date, chapter, image_arr, href })
                }
            }
        })
        respArray.map(el => {
            mysqlConnection.query(queryUtils.select_scraper_serie_cuevana(el.title, el.chapter), (err, result) => {
                if (!result[0]) {
                    const objToSave = { title: el.title, premiere_date: el.premiere_date, chapter: el.chapter, img_url: el.image_arr, link: el.href }
                    mysqlConnection.query(queryUtils.save_scraper_serie_cuevana, objToSave, (err) => {
                        if (err) console.log(err)
                        else {
                            console.log({ message: 'saved', el })
                            utils.sendTextAndImageSlackNotification('[** CUEVANA **] ' + el.title, 'N/A', el.premiere_date, 'N/A', el.image_arr, 'N/A', el.href)
                        }
                    })
                }
            })
        })
        return respArray
    } catch (error) {
        console.log(error);
        return error
    }
}

const scraping_cuevana_la_periferia = async () => {
    try {
        const $ = await request({
            uri: 'https://avohdlinks.latinomegahd.net/?v=lCe',
            transform: body => cheerio.load(body)
        });
        var respArray = []
        const title = $('.content h3').html()
        var href = []
        $('.tab_container').each((i, ele) => {
            $(ele).find('.tab_content').each((i, elem) => {
                const hrefdata = $(elem).find('a').attr('href')
                href.push(hrefdata)
            })
        })
        respArray.push({[title]:href})

        href.map((el,index) => {
            mysqlConnection.query(queryUtils.select_chapters_la_periferia(el), (err, result) => {
                if(err) throw err;
                if (!result[0]) {
                    const chapter = index+1
                    const payload = {chapter: chapter, url: el, image: 'https://i.imgur.com/tUupnoY.png'}
                    mysqlConnection.query(queryUtils.save_new_chapter_la_periferia, payload, (err, result) => {
                        if(err) throw err;
                        else {
                            console.log({ message: 'saved', el })
                            utils.sendTextAndImageSlackNotification(title, `Chapter ${chapter}`, 'N/A', 'N/A', 'https://i.imgur.com/tUupnoY.png', 'N/A', el)
                        }
                    })
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