const mysqlConnection = require('../database.js');
const utils = require('../utils/utils.js');
const queries_util = require('../utils/queries_util.js');

const execute_query = async (sentence) => {
    const response = await mysqlConnection.query(sentence);
    return response[0];
}

const available_currencies = async () => {
    const { server, api_key, endpoint } = await execute_query(queries_util.get_available_configs);
    const url = `${server}${endpoint}${api_key}`;
    return await utils.get_external_api(url);
}

const available_currencies_v2 = async () => {

}
module.exports = {available_currencies, available_currencies_v2}