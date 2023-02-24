const s3_service = require('./s3minio_service')
const {query} = require('../database')
const query_utils = require('../utils/queries_util')
const utils = require('../utils/utils')

const getEmailTemplate = async () => {
    const response = await s3_service.get_fObject('html-templates', 'templete_correo.html');
    return response
}

const getInfoToSendMail = async(email) => {
    var response = await query(query_utils.find_user(email))
    response = utils.query_respose_to_json(response)[0]
    userId = response.id
    var userInfo = await query(query_utils.get_user_info_by_user_api_id(userId))
    userInfo = utils.query_respose_to_json(userInfo)[0]
    return userInfo
}

module.exports = {getEmailTemplate, getInfoToSendMail}