const axios = require('axios');
const { response } = require('express');

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

const sendSlackNotification = async function (ip) {
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
        response = { message: `message sent to webhook with statusCode: ${res.status}` };
    }).catch(err => {
        throw err
    })
    return response;
}

const config_server_select = 'SELECT * FROM server_config.public_ip';

const query_lp_videos_select = 'SELECT * FROM url_videos_reuniones';

const insert_lp_videos = `INSERT INTO url_videos_reuniones SET ?`;

const config_server_select_by_ip = function (ip) {
    return config_server_select + ` WHERE public_ip ='${ip}'`
}

const updated_ip_configuration = function (ip) {
    return `UPDATE server_config.public_ip SET ? WHERE public_ip.public_ip = '${ip}'`
}

const update_lp_videos = function(id) {
    return `UPDATE url_videos_reuniones SET ? WHERE id = ${id}`;
}

const insert_ip_configuration = `INSERT server_config.public_ip SET ?`;

module.exports = { 
    getNewPublicIp, 
    sendSlackNotification, 
    updated_ip_configuration,
    config_server_select_by_ip,
    update_lp_videos,
    config_server_select, 
    query_lp_videos_select,
    insert_lp_videos,
    insert_ip_configuration
};