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

const sendSlackNotification = async function () {
    await axios.post(process.env.SLACK_WEBHOOK, {
        text: `hello word from Node JS API`
    }).then(res => {
        response = { message: `message sent to webhook with statusCode: ${res.status}` };
    }).catch(err => {
        throw err
    })
    console.log('response => ', response);
    return response;
}

const config_server_select = 'SELECT * FROM server_config.public_ip';

const config_server_select_by_ip = function (ip) {
    return config_server_select + ` WHERE public_ip ='${ip}'`
}

const updated_ip_configuration = function (ip) {
    return `UPDATE server_config.public_ip SET ? WHERE public_ip.public_ip = '${ip}'`
}


module.exports = { 
    getNewPublicIp, 
    sendSlackNotification, 
    config_server_select, 
    updated_ip_configuration,
    config_server_select_by_ip
};