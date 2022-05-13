const query_utils = require('../utils/queries_util.js')
const mysqlConnection = require('../database.js');

const getCompleteUserInformation = async(email) => {
    const response = await mysqlConnection.query(query_utils.find_shop_user(email));
    if(response[0]){
        const location = await mysqlConnection.query(query_utils.find_location(response[0].location));
        const city = await mysqlConnection.query(query_utils.find_city(location[0].city));
        const region = await mysqlConnection.query(query_utils.find_region(city[0].region));
        location[0].city = city[0];
        city[0].region = region[0];
        response[0].location = location[0];
        response[0].enable = (Boolean(JSON.parse(response[0].enable)))
        return response[0];
    }else {
        return {};
    }
}

module.exports = {
    getCompleteUserInformation
}