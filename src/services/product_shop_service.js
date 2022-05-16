const query_utils = require('../utils/queries_util.js')
const mysqlConnection = require('../database.js');

get_products = async () => {
    const response = await execute_query(query_utils.get_products);
    const ids = [];
    response.forEach(prd => {
        ids.push(prd.id);
        prd.product_image = []
        prd.enable = new Boolean(Number.parseInt(prd.enable));
    });

    const image_response = await execute_query(query_utils.get_products_images(ids));
    response.forEach(prd => {
        image_response.forEach(img => {
            if (prd.id === img.product_id) {
                prd.product_image.push(img);
            }
        })
    });

    return response;
}

const execute_query = async function (sentence) {
    const response = await mysqlConnection.query(sentence);
    return response;
}

module.exports = {get_products}