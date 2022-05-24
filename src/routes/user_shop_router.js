const express = require("express");
const auth = require("../middleware/auth");
const userShopService = require("../services/shop/user_shop_service");
const api_user_service = require("../services/user_service");



// Setup the express server router
const userShopRouter = express.Router();


userShopRouter.get('/all', [auth], async (req, res) => {

})

userShopRouter.get("/", [auth], async (req, res) => {
    var { email } = req.query;
    response = await userShopService.getCompleteUserInformation(email);
    res.send(response)
})

userShopRouter.get("/:id/roles", [auth], async (req, res) => {
    var { id } = req.params;
    res.send({ role: { id: 1 } })
})

userShopRouter.get("/existent-rut/:rut", [auth], async (req, res) => {
    var { rut } = req.params;
    const response = await userShopService.get_user_email_by_rut(rut)
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
            console.log(JSON.stringify(body));
            res.send(body);
        } else {
            res.status(400).send({message: "user already exist"});
        }
    }
})

// Export the userShopRouter
module.exports = userShopRouter;