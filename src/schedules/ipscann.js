var cron = require('node-cron');
const express = require('express');
const router = express.Router();

const task = cron.schedule('*/1 * * * *', () => {
    console.log('running a task every two minutes');
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    console.log(today.toISOString());
});

router.post('/scheduler', async (req, res) => {
    task.start();
});

module.exports = router;
