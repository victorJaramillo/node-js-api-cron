var cron = require('node-cron');
const express = require('express');
const router = express.Router();
const utils = require('../utils/utils.js');

const mysqlConnection = require('../database.js');

const SCHEDULED_TIME_STACK = process.env.SCHEDULED_TIME_STACK;

router.post('/scheduler', async (req, res) => {
    task.start();
});

const task = cron.schedule(`*/${SCHEDULED_TIME_STACK} * * * *`, () => {
    console.log(`running a task every ${SCHEDULED_TIME_STACK} minutes`);
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    utils.getNewPublicIp().then(res => {
        console.log(res);
    });
    console.log(today.toISOString());
});


module.exports = router;