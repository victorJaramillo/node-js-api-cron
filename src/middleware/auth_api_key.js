// Import dependencies
const jwt = require("jsonwebtoken")
const IS_PRODUCTION = process.env.IS_PRODUCTION
const JWT_KEY = process.env.JWT_KEY

const query_utils = require('../utils/queries_util');
const utils = require('../utils/utils');
const { query } = require('../database')

module.exports = async (req, res, next) => {
    const apikey = req.header("apikey")
    if(SON.parse(IS_PRODUCTION)){
        if (!apikey) return res.status(401).send({
            error: "unauthorized"
        });
    
        try {
            var response = await query(query_utils.get_api_key_by_value(apikey))
            response = JSON.parse(JSON.stringify(response));
            response = response[0]
            const decoded = utils.decode_base64(response.decoded_key_value)
            valid = await utils.validate_bcript(decoded, utils.decode_base64(apikey))
            if(!valid) {return invalidApiKeyResponse()}
        } catch (error) {
            return invalidApiKeyResponse()
        }
    }

    next();

    function invalidApiKeyResponse() {
        return res.status(401).send({
            ok: false,
            error: "ApiKey is not valid"
        });
    }
}