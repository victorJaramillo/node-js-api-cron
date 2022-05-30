const express = require("express");
const auth = require("../middleware/auth");
const user_shop_service = require("../services/shop/user_shop_service");
const api_user_service = require("../services/user_service");

const utils = require('../utils/utils.js')

// Setup the express server router
const userShopRouter = express.Router();


userShopRouter.get('/all', [auth], async (req, res) => {

})

userShopRouter.get("/", [auth], async (req, res) => {
    var { email } = req.query;
    response = await user_shop_service.getCompleteUserInformation(email);
    res.send(response)
})

userShopRouter.get("/:id/roles", [auth], async (req, res) => {
    var { id } = req.params;
    res.send({ role: { id: 1 } })
})

userShopRouter.get("/existent-rut/:rut", [auth], async (req, res) => {
    var { rut } = req.params;
    const response = await user_shop_service.get_user_email_by_rut(rut)
    res.send(response);
})

userShopRouter.post("/", [auth], async (req, res) => {
    const body = req.body;
    if (!Object.keys(body).length) {
        res.status(400).send({ message: 'body is empty' })
    } else {
        const { email } = body
        const user = await api_user_service.get_user_by_email(email)
        if (!user) {
            const user = await utils.get_hashed_user(body);
            const created_user_api = await api_user_service.create_api_user(user);
            if(created_user_api) {
                body.api_user_id = created_user_api.insertId;
                body.location = body.location.id
                delete body.password;
                const response = await user_shop_service.create_shop_user(body);
                if(response){
                    res.status(201).send({ message: 'user created' });
                }
            }
        } else {
            res.status(400).send({message: "user already exist"});
        }
    }
})

// Export the userShopRouter
module.exports = userShopRouter;