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

router.get('/scraping',[auth_apikey], async (req, res) => {
    task.start();
    const respo = await get_enabled_anime_to_scraping()
    const response = await for_enabled_anime(respo)
    res.send(response)
})
router.post('/scraping/new_scraping',[auth_apikey], async (req, res) => {
    const {title, url} = req.body
    try {
        var find_configured_anime = await query(queryUtils.get_enabled_anime_by_url(url))
        find_configured_anime = utils.query_respose_to_json(find_configured_anime)
        if(!find_configured_anime[0]){
            const object_to_save = {title:`${title}`, url:`${url}`, enable: true}
            await query(queryUtils.insert_enabled_anime(), object_to_save)
            res.status(201).send({message:`new scraping configured`, title:`${title}`, url:`${url}`})
        }else res.status(400).send({message:`this anime is already configured`})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/scraping/configured',[auth_apikey], async (req, res) => {
    const response = await query(queryUtils.configured_anime_scraping)

    res.send(utils.query_respose_to_json(response))
})

const task = cron.schedule(`*/${WEB_SCRAPING_TIME_STACK} * * * *`, async () => {
    if(IS_PRODUCTION){
        const respo = await get_enabled_anime_to_scraping()
        await for_enabled_anime(respo)
        console.log(`NEW ANIME Web Scraping excecution date ${today.toISOString()}`);
    }
})

const scraping_series = async (url) => {
    try {
        const $ = await request({
            uri: url,
            transform: body => cheerio.load(body)
        })
        var seasons = []
        var respArray = []
        $('.tvshows-template-default').each((i, ele) => {
            const serie = $(ele).find('div.dtsingle')
            var title = $(serie).find('div.data h1')
            title = $(title).text()
            const episodes = $(serie).find('div.sbox')
            $(episodes).find('div.se-a .episodios li').each((index, chapter) => {
                const cap_img = $(chapter).find('.imagen img.lazy').attr('data-src')
                const cap_num = $(chapter).find('.numerando')
                const cap_name = $(chapter).find('.episodiotitle a')
                const cap_link = $(chapter).find('.episodiotitle a').attr('href')
                var season_namber = $(cap_num).text().toString()
                try {
                    if(season_namber != ''){
    
                        season_namber = season_namber.split('-')
                        respArray.push(
                            {
                                title: title,
                                season: parseInt(season_namber[0].trim()),
                                chapter_name: $(cap_name).text(),
                                chapter_number: parseInt(season_namber[1].trim()),
                                chapter_image: cap_img,
                                chapter_link: cap_link
                            }
                        )
                        const elementExists = seasons.includes(parseInt(season_namber[0].trim()))
                        if (!elementExists) seasons.push(parseInt(season_namber[0].trim()))
                    }
                } catch (error) {
                    console.error(error);
                    utils.sendTextSlackNotification(error)
                }
            })
            console.log('Scraping anime:', title + ' - seasons:', seasons);
        })
        return respArray
    } catch (error) {
        console.log(error);
        return error
    }
}

const get_enabled_anime_to_scraping = async () => {
    const query_sentence = queryUtils.enable_anime_scraping;
    var response = await query(query_sentence)
    response = utils.query_respose_to_json(response)

    return response
}

const for_enabled_anime = async (array) => {
    var object_to_save_arr = []
    for (let i = 0; i < array.length; i++) {
        const { id, title, url } = array[i]
        console.log(url);
        const response = await scraping_series(url)
        var enable_anime_field = await query(queryUtils.get_enabled_anime_field(id))
        enable_anime_field = utils.query_respose_to_json(enable_anime_field)
        
        if (enable_anime_field.length === 0) {
            response.map(sc => {
                const object_to_save = buildObjectToSave(id, sc)
                object_to_save_arr.push(object_to_save)
                query(queryUtils.insert_enabled_anime_field(), object_to_save)
                const desc = `** NEW EPISODE DETECTED **. Episode number: ${object_to_save.chapter_number}`
                utils.sendNewAnimeNotification(title, desc, object_to_save.chapter_image, object_to_save.chapter_link)
                console.log('object_to_save => ', object_to_save);
            })
        } else {
            cleanArray = []
            enable_anime_field.map(x => {
                delete x.id;
                cleanArray.push(x)
            })
            const newChapterDetected = getAbsentValues(response, cleanArray)
            newChapterDetected.map((x) => {
                const object_to_save = buildObjectToSave(id, x)
                object_to_save_arr.push(object_to_save)
                query(queryUtils.insert_enabled_anime_field(), object_to_save)
                const desc = `** NEW EPISODE DETECTED **. Episode number: ${object_to_save.chapter_number}`
                utils.sendNewAnimeNotification(title, desc, object_to_save.chapter_image, object_to_save.chapter_link)
                console.log('object_to_save => ', object_to_save);
            })
        }

    }
    return object_to_save_arr;
}

const getAbsentValues = (arr1, arr2) => {
    let res = [];
    res = arr1.filter(el => {
        return !arr2.find(obj => {
            return (el.chapter_link === obj.chapter_link) && (el.chapter_link === obj.chapter_link);
        });
    });
    return res;
};


function buildObjectToSave(id, sc) {
    return {
        anime_id: id,
        season: sc.season,
        chapter_name: sc.chapter_name,
        chapter_number: sc.chapter_number,
        chapter_image: sc.chapter_image,
        chapter_link: sc.chapter_link
    };
}

module.exports = router