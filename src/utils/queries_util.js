const get_currconv_configs = 'SELECT tab1.server, tab1.api_key, tab2.endpoint  FROM server_config.free_apis_integrations AS tab1, server_config.free_apis_integrations_endpoint AS tab2 WHERE tab2.id = 2';
const get_available_configs = 'SELECT tab1.server, tab1.api_key, tab2.endpoint  FROM server_config.free_apis_integrations AS tab1, server_config.free_apis_integrations_endpoint AS tab2 WHERE tab2.id = 3';

module.exports = {
    get_currconv_configs,
    get_available_configs
}