const query_utils = require('../utils/queries_util.js')
const mysqlConnection = require('../database.js');

/**
 * 
 * @returns Array of products
 */
const get_products = async () => {
    const response = await execute_query(query_utils.get_products);
    const ids = [];
    response.forEach(prd => {
        ids.push(prd.id);
        prd.product_image = []
        prd.enable = new Boolean(Number.parseInt(prd.enable));
    });

    const image_response = await get_images_by_ids(ids);
    response.forEach(prd => {
        image_response.forEach(img => {
            if (prd.id === img.product_id) {
                prd.product_image.push(img);
            }
        })
    });

    return response;
}

/**
 * 
 * @param {identifier of product} id 
 * @returns complete product information using his unique identity
 */
const get_product_by_id = async (id) => {
    var response = await execute_query(query_utils.get_product_by_id(id));
    if (response) {
        response = response[0];
        const image_response = await get_images_by_ids(id);
        response.product_image = [];
        response.enable = Boolean(Number.parseInt(response.enable))
        image_response.forEach(x => {
            response.product_image.push(x)
        })
        return response;
    }
}

const execute_query = async function (sentence) {
    const response = await mysqlConnection.query(sentence);
    return response;
}

async function get_images_by_ids(ids) {
    return await execute_query(query_utils.get_products_images(ids));
}

const create_product = async (product) => {
    const values = {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        brand: product.brand,
        enable: product.enable,
        product_image: product.product_image[0].public_url
    }
    const response = await mysqlConnection.query(query_utils.create_product, values);
    if(response) {
        const img = {
            id_producto: response.insertId,
            url_publica: product.product_image[0].public_url,
            nombre_archivo: product.product_image[0].file_name,
            ultima_actualizacion: new Date()
        }
        const img_reponse = await mysqlConnection.query(query_utils.create_product_image, img);
        if(img_reponse)
        return {message: "product created successfully"}
    } else {
        return response;
    }
    console.log(response);
}

module.exports = { get_products, get_product_by_id, create_product }