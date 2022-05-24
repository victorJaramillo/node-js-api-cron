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

const get_external_api_with_security = async function (endpoint, key) {
    var response = {};
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


const find_user = function(email){
    return `SELECT * FROM server_config.api_users WHERE email = '${email}'`;
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
    sendTextSlackNotification,
    encode_hash_text,
    find_user,
    config_server_select,
    query_lp_videos_select,
    insert_lp_videos,
    insert_ip_configuration,
    select_godaddy_records,
    select_enabled_services,
};