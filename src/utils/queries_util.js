const get_currconv_configs = 'SELECT tab1.server, tab1.api_key, tab2.endpoint  FROM server_config.free_apis_integrations AS tab1, server_config.free_apis_integrations_endpoint AS tab2 WHERE tab2.id = 2';
const get_available_configs = 'SELECT tab1.server, tab1.api_key, tab2.endpoint  FROM server_config.free_apis_integrations AS tab1, server_config.free_apis_integrations_endpoint AS tab2 WHERE tab2.id = 3';

// Edipartstore
const get_products = 'SELECT id,name,description,price,stock,brand,enable,product_image FROM edipartstore.producto p  ';

const get_products_images = (ids) => {
    return `SELECT p.id_producto AS product_id, p.url_publica AS public_url, p.last_update FROM edipartstore.producto_imagen p WHERE p.id_producto IN (${ids})`
};

const get_product_by_id = (id) => {
    return get_products+`WHERE p.id = ${id}`
}

const find_user = function(email){
    return `SELECT * FROM server_config.api_users WHERE email = '${email}'`;
}

const create_new_user = `INSERT server_config.api_users SET ?`;

const create_new_shop_user = `INSERT edipartstore.usuario SET ?`;

const find_shop_user = (email) => {
    return `SELECT id, name, last_name, user_rut, user_rut_dv, email, address, location, enable
    FROM edipartstore.usuario
    WHERE email like '${email}'`;
}
const find_shop_user_by_rut = (rut) => {
    return `SELECT email FROM edipartstore.usuario
    WHERE user_rut = '${rut}'`
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

const find_region = `SELECT r.ID_REGION as id, r.REGION as region_name FROM edipartstore.region r`;

const find_region_by_id = (id) => {
    const query = find_region;
    return query+` WHERE r.ID_REGION = ${id}`
}

const find_cities_by_region_id = (region_id) => {
    return `SELECT c.ID_CIUDAD as id, c.CIUDAD as city_name FROM edipartstore.ciudad c WHERE c.ID_REGION = ${region_id}`;
}

const find_locations_by_city_id = (city_id) => {
    return `SELECT c.ID_COMUNA as id, c.COMUNA as location_name FROM edipartstore.comuna c WHERE c.ID_CIUDAD =  ${city_id}`;
}

const create_product = `INSERT INTO edipartstore.producto SET ?`;
const create_product_image = `INSERT INTO edipartstore.producto_imagen SET ?`;
const update_product = (id) => {
    return `UPDATE edipartstore.producto SET ? WHERE producto.id = '${id}'`
};

const get_all_product_images = 'SELECT * FROM edipartstore.producto_imagen';

const get_products_by_file_name = (file_name) => {
    return get_all_product_images+` WHERE file_name LIKE '${file_name}'`
}

const update_public_url = (file_name) => {
    return `UPDATE edipartstore.producto_imagen SET ? WHERE file_name = '${file_name}'`
}

const save_scraper_movies = 'INSERT INTO web_scraping.cuevana SET ?';

const save_scraper_serie_cuevana = 'INSERT INTO web_scraping.series_cuevana SET ?';

const save_scraper_pelis_panda = 'INSERT INTO web_scraping.pelis_panda SET ?';

const select_scraper_movies = (title, year) => {
    return `SELECT * FROM web_scraping.cuevana AS c WHERE c.title LIKE '${title}' AND c.date = '${year}'`
};

const select_scraper_serie_cuevana = (title, chapter) => {
    return `SELECT * FROM web_scraping.series_cuevana AS c WHERE c.title LIKE '${title}' AND c.chapter = '${chapter}'`
};

const select_scraper_pelis_panda = (title, url) => {
    return `SELECT * FROM web_scraping.pelis_panda AS c WHERE c.title LIKE '${title}' AND c.url = '${url}'`
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
    find_region,
    find_region_by_id,
    find_cities_by_region_id,
    find_locations_by_city_id,
    find_shop_user_by_rut,
    create_product,
    create_product_image,
    update_product,
    create_new_shop_user,
    get_all_product_images,
    get_products_by_file_name,
    update_public_url,
    save_scraper_movies,
    select_scraper_movies,
    save_scraper_pelis_panda,
    select_scraper_pelis_panda,
    select_scraper_serie_cuevana,
    save_scraper_serie_cuevana
}