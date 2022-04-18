const get_currconv_configs = 'SELECT tab1.server, tab1.api_key, tab2.endpoint  FROM server_config.free_apis_integrations AS tab1, server_config.free_apis_integrations_endpoint AS tab2 WHERE tab2.id = 2';
const get_available_configs = 'SELECT tab1.server, tab1.api_key, tab2.endpoint  FROM server_config.free_apis_integrations AS tab1, server_config.free_apis_integrations_endpoint AS tab2 WHERE tab2.id = 3';

// Edipartstore

const get_products = 'SELECT id,name,description,price,stock,brand,enable,product_image FROM edipartstore.producto p  ';

const get_products_images = (ids) => {
    return `SELECT p.id_producto AS product_id, p.url_publica AS public_url, p.ultima_actualizacion as last_update FROM edipartstore.producto_imagen p WHERE p.id_producto IN (${ids})`
};

module.exports = {
    get_currconv_configs,
    get_available_configs,
    get_products,
    get_products_images
}