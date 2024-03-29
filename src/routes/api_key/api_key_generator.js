const express = require('express');
const router = express.Router();

const utils = require('../../utils/utils');

const query_utils = require('../../utils/queries_util');
const { query } = require('../../database')
const auth = require('../../middleware/auth')
const Crypto = require('crypto')

router.post('/generate', [auth], async (req, res) => {
    const { key_name } = req.body
    var value = Crypto.randomBytes(40).toString('base64').slice(0, 40)
    var encoded = await utils.encode_hash_text(value)
    value = utils.encode_base64(value)
    encoded = utils.encode_base64(encoded)
    const apikey_value = {
        'key_name': key_name,
        'key_value': encoded,
        'decoded_key_value': value
    }
    const creted_response = await query(query_utils.create_api_key(), apikey_value)

    res.status(201).send({ 'generated_apikey': encoded })
})

module.exports = router