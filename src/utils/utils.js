const axios = require('axios');
const { response } = require('express');

const bcrypt = require("bcrypt");

const mysqlConnection = require('../database.js');

var getNewPublicIp = async function () {
    await axios.get('https://ifconfig.me')
        .then(respon => {
            ip = respon.data;
        }).catch(err => {
            throw err;
        });
    return { 'public_ip': ip };
}

const sendNewIpSlackNotification = async function (ip) {
    var response = {};
    const text = `Se ha cambiado la ip publica del servidor, la nueva IP es *${ip}*`;
    await axios.post(process.env.SLACK_WEBHOOK, {
        text: 'Nueva IP de servidor',
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": text
                }
            }
        ]
    }).then(res => {
        response = slack_message_response(res.status);
    }).catch(err => {
        throw err
    })
    return response;
}

const sendTextSlackNotification = async function (text) {
    var response = {};
    await axios.post(process.env.SLACK_WEBHOOK, {
        text: text
    }).then(res => {
        response = slack_message_response(res.status);
    }).catch(err => {
        throw err
    })
    return response;
}

const sendTextAndImageSlackNotification = async function (title, desc, date, quality, image_url, vote, link) {
    var response = {};
    const body = get_body_message(title, desc, date, quality, vote, link, image_url);
    await axios.post(process.env.SLACK_WEBHOOK_WEB_SCRAPING,
        body
    ).then(res => {
        response = slack_message_response(res.status);
    }).catch(err => {
        throw err
    })
    return response;
}

const sendNewAnimeNotification = async function (title, desc, image_url, link) {
    var response = {};
    const body = get_body_message(title, desc, '', '', '', link, image_url);
    await axios.post(process.env.SLACK_ANIME_NOTIFICATION,
        body
    ).then(res => {
        response = slack_message_response(res.status);
    }).catch(err => {
        throw err
    })
    return response;
}

const slack_message_response = function (statusCode) {
    return { message: `message sent to webhook with statusCode: ${statusCode}` };
}

const get_external_api = async function (endpoint) {
    var response = {};
    await axios.get(endpoint).then((resp) => {
        response = resp;
    }).catch(err => {
        throw err;
    });
    return response;
}

const post_external_api = async function (endpoint) {
    var response = {};
    await axios.get(endpoint).then((resp) => {
        response = resp;
    }).catch(err => {
        throw err;
    });
    return response;
}

const get_external_api_with_security = async function (endpoint, key, key_name) {
    var response = {};
    console.log(key_name === undefined);
    key_name === undefined ? key_name = 'Authorization' : key_name = key_name;
    await axios.get(endpoint, { headers: { 'Authorization': key } }).then((resp) => {
        response = resp.data;
    }).catch(err => {
        throw err;
    });
    return response;
}

const put_external_api_with_security = async function (endpoint, body, key) {
    var response = {};
    await axios.put(endpoint, body, { headers: { 'Authorization': key } }).then((resp) => {

        response = resp.status;
    }).catch(err => {
        throw err;
    });
    return response;
}

const patch_external_api_with_security = async function (endpoint, body, key) {
    var response = {};
    await axios.patch(endpoint, body, { headers: { 'Authorization': key } }).then((resp) => {
        response = resp.status;
    }).catch(err => {
        console.error(err.response.data);
        response = {status: err.response.status,data: err.response.data};
    });
    return response;
}

const delete_external_api_with_security = async function (endpoint, key) {
    var response = {};
    await axios.delete(endpoint, { headers: { 'Authorization': key } }).then((resp) => {
        response = resp.status;
    }).catch(err => {
        console.error(err.response.data);
        response = {status: err.response.status,data: err.response.data};
    });
    return response;
}

function get_body_message(title, desc, date, quality, vote, link, image_url) {
    return {
        "type": "home",
        "blocks": [
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": ":movie_camera: NEW MOVIE DETECTED",
                            "emoji": true
                        },
                        "style": "primary",
                        "value": "approve"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Title:* ${title}\n *Description*: *${desc}*\n *Date*: *${date}*\n *Quality*: *${quality}*\n*Vote*: ${vote}:star:\n*Link:* ${link}`
                },
                "accessory": {
                    "type": "image",
                    "image_url": `${image_url}`,
                    "alt_text": "plane"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": ":movie_camera: NEW MOVIE DETECTED",
                            "emoji": true
                        },
                        "style": "primary",
                        "value": "approve"
                    }
                ]
            },
            {
                "type": "divider"
            }
        ]
    };
}

async function get_hashed_user(body) {
    const hashed_password = await encode_hash_text(body.password);
    const user = { email: body.email, password: hashed_password };
    return user;
}

const config_server_select_by_ip = function (ip) {
    return config_server_select + ` WHERE public_ip ='${ip}'`
}

const updated_ip_configuration = function (ip) {
    return `UPDATE server_config.public_ip SET ? WHERE public_ip.public_ip = '${ip}'`
}

const update_lp_videos = function (id) {
    return `UPDATE url_videos_reuniones SET ? WHERE id = ${id}`;
}

const godaddy_url = function (url, dns) {
    return url.replace('{dns}', dns);
}

const buildGodaddyUrl = (url, arr) => {
    arr.forEach(element => {
        url = url+`/${element}`
    });
    return url
}

const encode_hash_text = async function (text) {
    const salt = await bcrypt.genSalt(10);
    const hashed_text = await bcrypt.hash(text, salt);
    return hashed_text;
}

const config_server_select = 'SELECT * FROM server_config.public_ip';

const query_lp_videos_select = 'SELECT * FROM url_videos_reuniones';

const insert_lp_videos = `INSERT INTO url_videos_reuniones SET ?`;

const insert_ip_configuration = `INSERT server_config.public_ip SET ?`;

const select_godaddy_records = `SELECT * FROM server_config.developer_api_keys WHERE developer_api_keys.stage = 'PROD'`;

const select_enabled_services = `SELECT service_name FROM server_config.enabled_services`;


const find_user = function (email) {
    return `SELECT * FROM server_config.api_users WHERE email = '${email}'`;
}

const UUID = () => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const urlSrcFromStrHtml = (strHtml) => {
    const imgRex = /<img.*?data-src="(.*?)"[^>]+>/g;
    const images = [];
    let img;
    while ((img = imgRex.exec(strHtml))) {
        images.push(img[1]);
    }
    return images
}

const validationBodyErrorMessage = (message) => {
    return { validation_error: `the parameter ${message} is required in body` }
}

const validationNullOrEmptyErrorMessage = (message) => {
    return { validation_error: `the parameter ${message} cannot be null or empty` }
}

const encode_base64 = (value) => {
    const encoded = Buffer.from(value, 'utf8').toString('base64')
    return encoded
}

const decode_base64 = (value) => {
    const decoded = Buffer.from(value, 'base64').toString('utf8')
    return decoded
}

const validate_bcript = async (text, hashed_test) => {
    var valid = await bcrypt.compare(text, hashed_test)
    return valid
}

const query_respose_to_json = (query_response) => {
    return JSON.parse(JSON.stringify(query_response))
}


module.exports = {
    getNewPublicIp,
    sendNewIpSlackNotification,
    updated_ip_configuration,
    config_server_select_by_ip,
    update_lp_videos,
    godaddy_url,
    get_external_api,
    get_external_api_with_security,
    put_external_api_with_security,
    patch_external_api_with_security,
    delete_external_api_with_security,
    sendTextSlackNotification,
    encode_hash_text,
    find_user,
    config_server_select,
    query_lp_videos_select,
    insert_lp_videos,
    insert_ip_configuration,
    select_godaddy_records,
    select_enabled_services,
    get_hashed_user,
    UUID,
    sendTextAndImageSlackNotification,
    urlSrcFromStrHtml,
    buildGodaddyUrl,
    validationBodyErrorMessage,
    validationNullOrEmptyErrorMessage,
    post_external_api,
    encode_base64,
    decode_base64,
    validate_bcript,
    query_respose_to_json,
    sendNewAnimeNotification
};