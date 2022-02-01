var cron = require('node-cron');
const express = require('express');
const router = express.Router();
const utils = require('../utils/utils.js');

const task = cron.schedule(`*/30 * * * *`, () => {
    console.log('running a task every 30 minutes');
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    utils.getNewPublicIp().then(res => {
        console.log(res);
    });
    console.log(today.toISOString());
});

router.post('/scheduler', async (req, res) => {
    task.start();
});

module.exports = router;
