const express = require("express");

const utils = require('../utils/utils.js')
const auth = require("../middleware/auth");
const user_service = require("../services/user_service.js");

// Setup the express server router
const router = express.Router();

router.post("/create", [auth], async (req, res) => {
    const body = req.body;
    if (!Object.keys(body).length) {
        res.status(400).send({ message: 'body is empty' })
    } else if (!body.email || !body.password) {
        res.status(400).send({ message: 'email or password is empty' })
    } else {
        // agregar lógica de verificación de email existente en la base de datos
        const user = await user_service.get_user_by_email(body.email);
        if (!user) {
            const hashed_password = await utils.encode_hash_text(req.body.password);
            const user = { email: req.body.email, password: hashed_password };
            const response = await user_service.create_api_user(user);
            if (response) {
                res.status(201).send({ message: 'user created' });
            }
        } else {
            res.status(400).send({ message: 'user already exist' });
        }
    }
})

// Export the router
module.exports = router;