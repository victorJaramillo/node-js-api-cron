const get_currconv_configs = 'SELECT tab1.server, tab1.api_key, tab2.endpoint  FROM server_config.free_apis_integrations AS tab1, server_config.free_apis_integrations_endpoint AS tab2 WHERE tab2.id = 2';
const get_available_configs = 'SELECT tab1.server, tab1.api_key, tab2.endpoint  FROM server_config.free_apis_integrations AS tab1, server_config.free_apis_integrations_endpoint AS tab2 WHERE tab2.id = 3';

// Edipartstore
const get_products = 'SELECT id,name,description,price,stock,brand,enable,product_image FROM edipartstore.producto p  ';

const get_products_images = (ids) => {
    return `SELECT p.id_producto AS product_id, p.url_publica AS public_url, p.ultima_actualizacion as last_update FROM edipartstore.producto_imagen p WHERE p.id_producto IN (${ids})`
};

const get_product_by_id = (id) => {
    return get_products+`WHERE p.id = ${id}`
}

const find_user = function(email){
    return `SELECT * FROM server_config.api_users WHERE email = '${email}'`;
}

const create_new_user = `INSERT server_config.api_users SET ?`;

const find_shop_user = (email) => {
    return `SELECT ID_USUARIO AS id, NOMBRE AS name, APELLIDO AS last_name, RUT_USUARIO AS user_rut, DV_USUARIO AS user_rut_dv, CORREO_ELECTRONICO AS email, DIRECCION AS address, ID_COMUNA AS location, HABILITADO AS enable
    FROM edipartstore.usuario
    WHERE CORREO_ELECTRONICO like '${email}'`;
}

const find_location = (location) => {
    return `SELECT 
    c.ID_COMUNA AS id, 
    c.COMUNA AS location_name, 
    c.ID_CIUDAD AS city 
    FROM edipartstore.comuna  
    c WHERE c.ID_COMUNA  = ${location}`
}

const find_city = (city) => {
    return `SELECT 
    c2.ID_CIUDAD as id, 
    c2.CIUDAD as city_name, 
    c2.ID_REGION as region 
    FROM edipartstore.ciudad c2 
    where c2.ID_CIUDAD = ${city}`
}

const find_region = (region) => {
    return `SELECT r.ID_REGION as id, r.REGION as region_name FROM edipartstore.region r WHERE r.ID_REGION = ${region}`
}

module.exports = {
    get_currconv_configs,
    get_available_configs,
    get_products,
    get_products_images,
    get_product_by_id,
    find_user,
    create_new_user,
    find_shop_user,
    find_location,
    find_city,
    find_region
}