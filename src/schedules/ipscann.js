var cron = require('node-cron');
const express = require('express');
const router = express.Router();
const utils = require('../utils/utils.js');

const mysqlConnection = require('../database.js');

const SCHEDULED_TIME_STACK = process.env.SCHEDULED_TIME_STACK;

router.post('/scheduler', async (req, res) => {
    task.start();
    res.send({message: 'Ok'})
});

const task = cron.schedule(`*/${SCHEDULED_TIME_STACK} * * * *`, () => {
    console.log(`running a task every ${SCHEDULED_TIME_STACK} minutes`);
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    utils.getNewPublicIp().then(ip => {
        const { public_ip } = ip;
        mysqlConnection.query(utils.config_server_select_by_ip(public_ip), (error, result) => {
            if (error) throw error;
            if (result.length === 0) {
                const values = {
                    "public_ip": ip.public_ip,
                    "last_update": new Date(),
                    "previous_public_ip": ip.public_ip,
                    "changed_ip": false
                };
                mysqlConnection.query(utils.insert_ip_configuration, values, (error, results) => {
                    if (error) throw error;
                    else {
                        console.log({ 'message': 'field inserted successfully' });
                        utils.sendSlackNotification(public_ip).then( (x) => {
                            console.log(x);
                        });
                    }
                });
            } else {
                console.log(`Se mantiene la IP actual del servidor => ${public_ip}`);
            }
        });
    });
    console.log(`excecution date ${today.toISOString()}`);
});


module.exports = router;