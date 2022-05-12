const express = require("express");
const bcrypt = require("bcrypt");
const mysqlConnection = require('../database.js');

const utils = require('../utils/utils.js')
const query_utils = require('../utils/queries_util.js')
const auth = require("../middleware/auth");

// Setup the express server router
const router = express.Router();

router.post("/create", [auth], async (req, res) => {
    const body = req.body;
    if (!Object.keys(body).length) {
        const response_message = { message: 'body vacio' };
        res.status(400).send(response_message)
    } else if (!body.email || !body.password) {
        const response_message = { message: 'email or password is empty' };
        res.status(400).send(response_message)
    } else {
        // agregar lógica de verificación de email existente en la base de datos
        const find_user_query = find_user.find_user(body.email);
        const user = await mysqlConnection.query(find_user_query);
        if(!user[0]){
            const hashed_password = await utils.encode_hash_text(req.body.password);
            const user = { email: req.body.email, password: hashed_password };
            const response = await mysqlConnection.query(query_utils.create_new_user, user);
            if (response) {
                res.status(201).send({ message: 'user created' });
            }
        }else{
            res.status(400).send({ message: 'user already exist' });
        }
    }
})

// Export the router
module.exports = router;