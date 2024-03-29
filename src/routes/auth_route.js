// Import dependencies
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");

const utils = require('../utils/utils.js')
const mysqlConnection = require('../database.js');

// Setup the express server router
const router = express.Router();
const INVALID_CREDELTIALS_MESSAGE = { message: 'Invalid email or password.' }

const EXPIRE_JWT_TOKEN = process.env.EXPIRE_JWT_TOKEN

// On post
router.post("", async (req, res) => {

    // Get to user from the database, if the user is not there return error
    const { email, password } = req.body
    let find_user_query = utils.find_user(email);
    const user = await find_user(find_user_query);
    if (user == undefined) {
        res.status(400).send(INVALID_CREDELTIALS_MESSAGE);
    } else {
        // Compare the password with the password in the database
        try {
            var valid = await utils.validate_bcript(password, user.password)
            if (!valid) { res.status(400).send(INVALID_CREDELTIALS_MESSAGE) }
            delete user.password;
            const token = jwt.sign({
                id: user._id, email
            }, "jwtPrivateKey", { expiresIn: EXPIRE_JWT_TOKEN });

            res.send({
                ok: true,
                token: token
            });
        } catch (error) {
            console.log(`auth bad request ERROR: => ${JSON.stringify(req.body)} `);
            console.log(error);
        }
    }

});

const find_user = async function (find_user_query) {
    const response = await mysqlConnection.query(find_user_query);
    return response[0];
}

// Export the router
module.exports = router;