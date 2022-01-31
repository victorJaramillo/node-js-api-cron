const express = require('express');
const routerWebHook = express.Router();
const axios = require('axios');

routerWebHook.get('/webhook', (req, resp) => {
    getNewPublicIp(resp);
});

async function getNewPublicIp(resp) {
    await axios.get('https://ifconfig.me')
        .then(respon => {
            console.log(respon.data);
            ip = respon.data;
            axios.post('https://hooks.slack.com/services/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', {
                text: `hello word from Node JS API, public IP: ${ip}`
            }).then(res => {
                console.log(`statusCode: ${res.status}`);
                resp.send({ message: 'message sent to webhook' });
            });
        }).catch(err => {
            throw err;
        });
}


module.exports = routerWebHook;