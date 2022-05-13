const express = require("express");
const auth = require("../middleware/auth");
const userShopService = require("../services/user_shop_service");

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
    console.log(id);
    res.send({role:{id: 1}})
})

// Export the userShopRouter
module.exports = userShopRouter;