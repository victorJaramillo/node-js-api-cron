// Import dependencies
const jwt = require("jsonwebtoken")
const IS_PRODUCTION = process.env.IS_PRODUCTION
const JWT_KEY = process.env.JWT_KEY

const query_utils = require('../utils/queries_util');
const utils = require('../utils/utils');
const { query } = require('../database')

const ERROR_MESSAGES = Object.freeze(
    {
        invalid_apikey: 'ApiKey is not valid', 
        not_enabled: "the resource is not enabled, please contact the administrator"
    }
    )

module.exports = async (req, res, next) => {
    const apikey = req.header("apikey")
    const {baseUrl, method, url} = req
    if(!JSON.parse(IS_PRODUCTION)){
        if (!apikey) return res.status(401).send({
            error: "unauthorized"
        });
    
        try {
            var response = await query(query_utils.get_api_key_by_value(apikey))
            response = JSON.parse(JSON.stringify(response));
            response = response[0]
            const decoded = utils.decode_base64(response.decoded_key_value)
            valid = await utils.validate_bcript(decoded, utils.decode_base64(apikey))
            if(!valid) {return unauthorizedResponse(ERROR_MESSAGES.invalid_apikey)}
            else {
                const endpoint = baseUrl+url.split('?')[0]
                var isEnable = await query(query_utils.get_api_key_enable_endpoint(endpoint, method, apikey))
                isEnable = utils.query_respose_to_json(isEnable)[0].enable ? true : false
                if(!isEnable){
                    return unauthorizedResponse(ERROR_MESSAGES.not_enabled)
                }
            }
        } catch (error) {
            console.error(error);
            return unauthorizedResponse(ERROR_MESSAGES.invalid_apikey)
        }
    }

    next();

    function unauthorizedResponse(message) {
        return res.status(401).send({
            ok: false,
            message: message
        });
    }
}