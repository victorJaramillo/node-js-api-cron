const query_utils = require('../../utils/queries_util')
const {mysqlConnection, query} = require('../../database');


const find_all_enabled_services = async() => {
    return await query(query_utils.get_all_enabled_services);
}
const find_all_enabled_services_by_id = async(id) => {
    const response = await query(query_utils.get_all_enabled_services_by_id(id));
    if(response[0]){
        return response[0]
    }else {
        return {}
    }
}

const deleteServiceByIds = async(id) => {
    const body = {id: id}
    return await query(query_utils.delete_enabled_services_by_ids(), body)
}

const saveNewEnabledService = async (body) => {
    const response = await query(query_utils.save_new_enabled_service, body)
    return {status: 201, message: 'field suscessfully created', created_object: {id: response.insertId, service_name: body.service_name}}
}

module.exports = {
    find_all_enabled_services, 
    find_all_enabled_services_by_id, 
    deleteServiceByIds,
    saveNewEnabledService
}