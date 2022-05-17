const query_utils = require('../utils/queries_util.js')
const mysqlConnection = require('../database.js');

const getCompleteUserInformation = async(email) => {
    const query = query_utils.find_shop_user(email);
    const response = await mysqlConnection.query(query);
    if(response[0]){
        const location = await mysqlConnection.query(query_utils.find_location(response[0].location));
        const city = await mysqlConnection.query(query_utils.find_city(location[0].city));
        const region = await mysqlConnection.query(query_utils.find_region_by_id(city[0].region));
        location[0].city = city[0];
        city[0].region = region[0];
        response[0].location = location[0];
        response[0].enable = (Boolean(JSON.parse(response[0].enable)))
        return response[0];
    }else {
        return {};
    }
}

const get_user_email_by_rut = async(rut) => {
    var response = await mysqlConnection.query(query_utils.find_shop_user_by_rut(rut));
    if(response[0]) {
        response = response[0]
        return response
    }else {
        return {}
    }
}

module.exports = {
    getCompleteUserInformation,
    get_user_email_by_rut
}