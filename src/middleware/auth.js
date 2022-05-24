// Import dependencies
const jwt = require("jsonwebtoken");
const IS_PRODUCTION = process.env.IS_PRODUCTION;

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if(JSON.parse(IS_PRODUCTION)){
        if (!token) return res.status(401).send({
            error: "unauthorized"
        });
    
        try {
            const decoded = jwt.verify(token, "jwtPrivateKey");
            req.user = decoded;
        } catch (error) {
            return res.status(401).send({
                ok: false,
                error: "Token expired"
            });
        }
    }

    next();
}