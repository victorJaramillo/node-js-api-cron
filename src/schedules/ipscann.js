var cron = require('node-cron');
const express = require('express');
const router = express.Router();
const utils = require('../utils/utils.js');

const { mysqlConnection, query } = require('../database.js');
const s3minio_service = require('../services/s3minio_service.js');
const product_shop_service = require('../services/shop/product_shop_service.js');


const SCHEDULED_TIME_STACK = process.env.SCHEDULED_TIME_STACK;
const IS_PRODUCTION = process.env.IS_PRODUCTION;
const bucketName = process.env.MINIO_BUCKET;

router.post('/scheduler', async (req, res) => {
    task.start();
    res.send({ message: 'Ok' })
});

const task = cron.schedule(`*/${SCHEDULED_TIME_STACK} * * * *`, () => {
    console.log(`running a task every ${SCHEDULED_TIME_STACK} minutes`);
    public_url_images()
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    if (JSON.parse(IS_PRODUCTION)) {
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
                        if (error) {
                            utils.sendNewIpSlackNotification(error);
                            throw error;
                        }
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
    }
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
                    if (JSON.parse(IS_PRODUCTION)) {
                        utils.put_external_api_with_security(dns_records_endoint, array_dns_records, authorization).then((res, err) => {
                            if (err) { throw err }
                            else {
                                const msg = `Los registros de DNS, se actualizaron correctamente, status: ${res}`;
                                console.log(msg);
                                utils.sendTextSlackNotification(msg)
                            }
                        });
                    }
                    response = (array_dns_records);
                })
            });

        }
    });
    return response
}

const public_url_images = async () => {
    const timeElapsed = Date.now()
    const start_date = new Date(timeElapsed)
    console.log(`Start date excecution ${start_date.toISOString()}`)
    if (JSON.parse(IS_PRODUCTION)) {
        const update_public_url = await product_shop_service.get_products_images()
        for (const img of update_public_url) {

            const { file_name, last_update } = img
            var diff = start_date.getTime() - last_update.getTime()
            diff = diff / (1000 * 3600 * 24)
            if (diff >= 2) {
                const { public_url } = await s3minio_service.public_url(bucketName, file_name)
                const product_image = { last_update: start_date, url_publica: public_url }

                const update_public_url = await product_shop_service.update_public_url(file_name, product_image)

                console.log(JSON.stringify(`file ${file_name}, ${update_public_url.message}`))
            }
        }

    }
    const end_date = new Date(timeElapsed)
    console.log(`End date excecution ${end_date.toISOString()}`)
}


module.exports = router;