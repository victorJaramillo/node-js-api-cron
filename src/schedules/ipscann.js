var cron = require('node-cron');
const express = require('express');
const router = express.Router();
const utils = require('../utils/utils.js');

const {mysqlConnection, query} = require('../database.js');

const SCHEDULED_TIME_STACK = process.env.SCHEDULED_TIME_STACK;

router.post('/scheduler', async (req, res) => {
    task.start();
    res.send({ message: 'Ok' })
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
                mysqlConnection.query(utils.insert_ip_configuration, values, (error) => {
                    if (error) throw error;
                    else {
                        console.log({ 'message': 'field inserted successfully' });
                        utils.sendNewIpSlackNotification(public_ip).then((message) => {
                            console.log(message);
                        });
                        update_godaddy_records(public_ip);
                    }
                });
            } else {
                console.log(`Se mantiene la IP actual del servidor => ${public_ip}`);
            }
        });
    });
    console.log(`excecution date ${today.toISOString()}`);
});

const update_godaddy_records = function (new_ip) {
    var response = {};
    mysqlConnection.query(utils.select_godaddy_records, (error, results) => {
        if (error) throw error;
        else {
            const { key, secret, endpoint_integration, dns } = results[0];
            const dns_records_endoint = utils.godaddy_url(endpoint_integration, dns);
            const authorization = `sso-key ${key}:${secret}`;
            utils.get_external_api_with_security(dns_records_endoint, authorization).then((array_dns_records) => {
                mysqlConnection.query(utils.select_enabled_services, (error, results) => {
                    Object.keys(results).forEach((data) => {
                        for (const element of array_dns_records) {
                            if (element.name === results[data].service_name) {
                                element.data = new_ip
                                break;
                            }
                        }
                    })
                    utils.put_external_api_with_security(dns_records_endoint, array_dns_records, authorization).then((res, err) => {
                        if (err) { throw err }
                        else {
                            console.log(`Los registros de DNS, han sido actualizados correctamente, status: ${res}`);
                            utils.sendTextSlackNotification(`Los registros de DNS, han sido actualizados correctamente, status: ${res}`)
                        }
                    });
                    response = (array_dns_records);
                })
            });

        }
    });
    return response
}


module.exports = router;