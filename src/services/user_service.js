const mysqlConnection = require("../database");
const query_utils = require('../utils/queries_util.js')

const get_user_by_email = async (email) => {
    const user = await mysqlConnection.query(query_utils.find_user(email));
    if (user[0]) {
        return user[0];
    } else {
        return null
    }
}

const create_api_user = async (user_values) => {
    const response = await mysqlConnection.query(query_utils.create_new_user, user_values)
        .catch(e => {
            return e;
        });

    if (response) {
        return response;
    }
}

module.exports = { get_user_by_email, create_api_user }