const s3_service = require('./s3minio_service')

const getEmailTemplate = async () => {
    const response = await s3_service.get_fObject('html-templates', 'templete_correo.html');
    return response
}

module.exports = {getEmailTemplate}