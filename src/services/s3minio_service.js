const s3 = require('../minio.js');

const bucketName = process.env.MINIO_BUCKET;

const public_url = async(name, expiry) => {
    const resposne = await s3.get_public_url(bucketName, name, expiry);
    return resposne;
}

const list_bucket_objects = async(bucket_name) => {
    const response = await s3.list_bucket_objects(bucket_name != undefined ? bucket_name : bucketName);
    return response;
}

const list_bucket = async() => {
    return await s3.list_bucket();
}

const create_bucket = async (bucket_name) => {
    const response = await s3.create_bucket(bucket_name);
    return response;
}

const upload_file = async (file_name, file_data) => {
    const response = await s3.upload_file(file_name, file_data);
    return response;
}

module.exports = {public_url, list_bucket_objects, list_bucket, create_bucket, upload_file}