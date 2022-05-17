const query_utils = require('../utils/queries_util.js')
const mysqlConnection = require('../database.js');

const find_regions = async () => {
    var response = await mysqlConnection.query(query_utils.find_region());
    if(response) {
        return response;
    } else {
        return [];
    }
}

const find_cities_by_region_id = async (region_id) => {
    var response = await mysqlConnection.query(query_utils.find_cities_by_region_id(region_id));
    if(response) {
        return response;
    } else {
        return [];
    }
}

const find_locations_by_city_id = async (city_id) => {
    var response = await mysqlConnection.query(query_utils.find_locations_by_city_id(city_id));
    if(response) {
        return response;
    } else {
        return [];
    }
}

module.exports = {find_regions, find_cities_by_region_id, find_locations_by_city_id}