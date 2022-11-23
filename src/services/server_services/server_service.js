const query_utils = require('../../utils/queries_util')
const utils = require('../../utils/utils')
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

const find_all_enabled_services_by_name = async(name) => {
    const response = await query(query_utils.get_enabled_services_by_name(name))
    if(response[0]){
        return response[0]
    }else {
        return {}
    }
}

const deleteServiceByIds = async(id) => {
    const body = {id: id}
    const recordToRemove = await find_all_enabled_services_by_id(id)
    const {url, authorization} = await godaddyUrlAndAuthorization()
    const arr = [recordToRemove.type, recordToRemove.service_name]
    const buildedUrl = utils.buildGodaddyUrl(url, arr)
    const godaddyResponse = await utils.delete_external_api_with_security(buildedUrl, authorization)
    if(godaddyResponse === 204){
        const response = await query(query_utils.delete_enabled_services_by_ids(), body)
        return response
    }else {
        return godaddyResponse
    }

}

const saveNewEnabledService = async (body) => {
    const {url, authorization} = await godaddyUrlAndAuthorization()
    const { public_ip } = await utils.getNewPublicIp()
    const goDaddyBody = [{ data: public_ip, name: body.service_name, ttl: 600, type: "A" }]
    const godaddyResponse = await utils.patch_external_api_with_security(url, goDaddyBody, authorization);
    if (godaddyResponse === 200) {
        const response = await query(query_utils.save_new_enabled_service, body)
        return {
            status: 201,
            message: 'field suscessfully created',
            created_object: {
                id: response.insertId,
                service_name: body.service_name
            }
        }
    } else {
        return godaddyResponse
    }
}

const godaddyUrlAndAuthorization = async() => {
    const getGodaddyConfigServer = await query(utils.select_godaddy_records);
    const { key, secret, endpoint_integration, dns } = getGodaddyConfigServer[0];
    const dns_records_endoint = utils.godaddy_url(endpoint_integration, dns);
    const authorization = `sso-key ${key}:${secret}`;

    return {url: dns_records_endoint, authorization: authorization}
}

module.exports = {
    find_all_enabled_services, 
    find_all_enabled_services_by_id, 
    deleteServiceByIds,
    saveNewEnabledService,
    find_all_enabled_services_by_name
}