// Import dependencies
const jwt = require("jsonwebtoken")
const IS_PRODUCTION = process.env.IS_PRODUCTION
const JWT_KEY = process.env.JWT_KEY

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token")
    if(JSON.parse(IS_PRODUCTION)){
        if (!token) return res.status(401).send({
            error: "unauthorized"
        });
    
        try {
            const decoded = jwt.verify(token, JWT_KEY);
            req.user = decoded
        } catch (error) {
            return res.status(401).send({
                ok: false,
                error: "Token expired"
            })
        }
    }

    next();
}