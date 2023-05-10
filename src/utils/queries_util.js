const SCHEMAS = Object.freeze(
    {
        dashboard: process.env.DASHBOARD_DB,
        scraping: process.env.SCRAPING_DB,
        server_config: process.env.SERVER_CONFIG_DB,
    }
)
const BDs = Object.freeze(
    {
        chores: process.env.CHORES_TODO
    }
)

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

const save_scraper_movies = `INSERT INTO ${SCHEMAS.scraping}.cuevana SET ?`;

const save_scraper_serie_cuevana = `INSERT INTO ${SCHEMAS.scraping}.series_cuevana SET ?`;

const save_scraper_pelis_panda = `INSERT INTO ${SCHEMAS.scraping}.pelis_panda SET ?`;

const select_scraper_movies = (title, year) => {
    return `SELECT * FROM ${SCHEMAS.scraping}.cuevana AS c WHERE c.title LIKE '${title}' AND c.date = '${year}'`
};

const select_scraper_serie_cuevana = (title, chapter) => {
    return `SELECT * FROM ${SCHEMAS.scraping}.series_cuevana AS c WHERE c.title LIKE '${title}' AND c.chapter = '${chapter}'`
};

const select_scraper_pelis_panda = (title, url) => {
    return `SELECT * FROM ${SCHEMAS.scraping}.pelis_panda AS c WHERE c.title LIKE '${title}' AND c.url = '${url}'`
}

const select_series = 'SELECT * FROM torrents.series s';

const select_series_url = 'SELECT * FROM torrents.series_url s';

const select_series_url_by_id = (id) => {
    return select_series_url + ` WHERE id = ${id}`
};

const select_series_where_name = (name) => {
    return select_series+` WHERE s.serie_name LIKE '${name}'`
}
const select_series_where_ids = (ids) => {
    return select_series+` WHERE s.id IN (${ids})`
}

const save_new_serie = 'INSERT INTO torrents.series SET ?';

const save_new_serie_url = 'INSERT INTO torrents.series_url SET ?';

const select_chapters_la_periferia = (name) => {
    return `SELECT * FROM ${SCHEMAS.scraping}.la_periferia l WHERE l.url LIKE '${name}'`
}

const save_new_chapter_la_periferia = 'INSERT INTO web_scraping.la_periferia SET ?'

const get_all_enabled_services = 'SELECT * FROM server_config.enabled_services x'

const get_all_enabled_services_by_id  = (id) => {
    return get_all_enabled_services+` WHERE x.id = ${id}`
}

const get_enabled_services_by_name  = (name) => {
    return get_all_enabled_services+` WHERE x.service_name LIKE '${name}'`
}

const delete_enabled_services_by_ids  = () => {
    return `DELETE FROM ${SCHEMAS.server_config}.enabled_services WHERE ?`
}

const save_new_enabled_service = `INSERT INTO ${SCHEMAS.server_config}.enabled_services SET ?` 

const save_new_chilean_info = 'INSERT INTO chilean_info.rut_info SET ?';
const get_chilean_info = 'SELECT * FROM chilean_info.rut_info'
const get_chilean_info_by_rut = (rut) => {
    return `${get_chilean_info} WHERE rut LIKE '${rut}'`
};

const get_chilean_info_by_name_and_lastname = (name, lastname) => {
    return `${get_chilean_info} WHERE name LIKE UPPER('%${name}%') AND name LIKE  UPPER('%${lastname}%')`
}

const get_api_key_by_value = (value) => {
    return `SELECT decoded_key_value FROM ${SCHEMAS.server_config}.apikeys a WHERE a.key_value LIKE '${value}'`
}

const get_api_key_enable_endpoint = (endpoint, method, apikey) => {
    return `SELECT (COUNT(*)) AS enable FROM 
    ${SCHEMAS.server_config}.apikeys_endpoint_enables a 
    JOIN ${SCHEMAS.server_config}.apikeys a2 ON a.api_id = a2.id 
    WHERE a.endpont = '${endpoint}' AND a.method = '${method}'
    AND a2.key_value = '${apikey}'`
}

const create_api_key = () => {
    return `INSERT INTO ${SCHEMAS.server_config}.apikeys SET ?`
}
const get_api_keys = () => {
    return `SELECT * FROM ${SCHEMAS.server_config}.apikeys a`
}

const get_user_info_by_user_api_id = (userId) => {
    return `SELECT x.* FROM edipartstore.usuario x WHERE x.api_user_id = ${userId}`
}

const delete_serie_or_movie = (id) => {
    return `DELETE FROM torrents.series_url WHERE id = ${id}`
}

const delete_serie_or_movie_name = (id) => {
    return `DELETE FROM torrents.series WHERE id = ${id}`
}

const select_anime_scraping = `SELECT * FROM ${SCHEMAS.scraping}.anime a`

const enable_anime_scraping =  `${select_anime_scraping} WHERE a.enable = TRUE`;

const get_enabled_anime_field = (anime_id) => {
    return `SELECT * FROM ${SCHEMAS.scraping}.anime_scraping as2 WHERE as2.anime_id = ${anime_id}`
}

const insert_enabled_anime_field = () => {
    return `INSERT INTO ${SCHEMAS.scraping}.anime_scraping SET ?`
}

const insert_enabled_anime = () => {
    return `INSERT INTO ${SCHEMAS.scraping}.anime SET ?`
}

const get_enabled_anime_by_url = (value) => {
    return `${select_anime_scraping} WHERE a.url LIKE '${value}'`
}

const configured_anime_scraping =  `SELECT as2.season, a.title, as2.chapter_name, as2.chapter_image,as2.chapter_link, 
                                    CASE as2.clicked 
                                    WHEN '1' THEN true 
                                    ELSE false END AS clicked
                                    FROM ${SCHEMAS.scraping}.anime a 
                                    JOIN ${SCHEMAS.scraping}.anime_scraping as2 
                                    ON as2.anime_id = a.id WHERE a.enable = TRUE`;
                                    
const update_clicked_url = (url) => {
    return `UPDATE ${SCHEMAS.scraping}.anime_scraping SET ? WHERE chapter_link LIKE '${url}'`
}

const get_animes_configured = 'SELECT * FROM web_scraping.anime a'

const activate_desactivate_anime = (id) => {
    return `UPDATE web_scraping.anime SET ? WHERE id = ${id}`
}

const get_chores_to_do = `SELECT 
                            ctd.task_id, 
                            ctd.task_name, 
                            ctd.created, CASE ctd.status
                            WHEN '1' THEN true 
                            ELSE false END AS status FROM ${SCHEMAS.dashboard}.${BDs.chores} ctd`

const save_chores_to_do = `INSERT INTO ${SCHEMAS.dashboard}.${BDs.chores} SET ?`

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
    save_scraper_serie_cuevana,
    save_new_serie,
    save_new_serie_url,
    select_series,
    select_series_where_name,
    select_series_url,
    select_series_where_ids,
    select_chapters_la_periferia,
    save_new_chapter_la_periferia,
    get_all_enabled_services,
    get_all_enabled_services_by_id,
    delete_enabled_services_by_ids,
    save_new_enabled_service,
    get_enabled_services_by_name,
    select_series_url_by_id,
    save_new_chilean_info,
    get_chilean_info_by_rut,
    get_chilean_info_by_name_and_lastname,
    get_api_key_by_value,
    create_api_key,
    get_user_info_by_user_api_id,
    delete_serie_or_movie,
    delete_serie_or_movie_name,
    enable_anime_scraping,
    get_enabled_anime_field,
    insert_enabled_anime_field,
    insert_enabled_anime,
    get_enabled_anime_by_url,
    configured_anime_scraping,
    update_clicked_url,
    get_animes_configured,
    activate_desactivate_anime,
    get_api_key_enable_endpoint,
    get_api_keys,
    get_chores_to_do,
    save_chores_to_do
}