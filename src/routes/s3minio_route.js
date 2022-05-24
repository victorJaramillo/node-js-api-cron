const express = require('express');
const s3Router = express.Router();

const s3 = require('../minio.js');
const auth = require("../middleware/auth");

const bucketName = process.env.MINIO_BUCKET;

s3Router.post('/upload', [auth], async (req, res) => {
    const { name, data } = req.files.file;
    const response = await s3.upload_file(name, data);
    if (response) {
        const public_url_response = await s3.get_public_url(bucketName, name);
        res.send({ message: 'ok', etag: response.etag, public_url: public_url_response.public_url });
    }
})

s3Router.get('/buckets', [auth], async (req, res) => {
    const response = await s3.list_bucket();
    if (response)
        res.send(response)
})

s3Router.post('/create/bucket', [auth], async (req, res) => {
    const response = await s3.create_bucket('test')
    if (response)
        res.send(response)
})

s3Router.get('/bucket/objects/buckets', [auth], async (req, res) => {
    const { bucket_name } = req.query
    const response = await s3.list_bucket_objects(bucket_name)
    if (response)
        res.send(response)
})

s3Router.get('/bucket/objects/public-url', [auth], async (req, res) => {
    const { bucket_name, file_name, expiry } = req.query;
    const response = await s3.get_public_url(bucket_name, file_name, expiry)
    res.send(response)
})

s3Router.get('/bucket/objects', [auth], async (req, res) => {

})


module.exports = s3Router