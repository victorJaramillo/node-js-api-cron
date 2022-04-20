const express = require('express');
const s3Router = express.Router();

const s3 = require('../minio.js');
const auth = require("../middleware/auth");

s3Router.post('/upload', [auth], async (req, res) => {
    console.log(req.files);
    console.log('name => ',req.files);
    const response = await s3.upload_file(req.files.file.name, req.files.file.data);
    if (response)
    res.send({message: 'ok'})
})

s3Router.get('/buckets', [auth], async (req, res) => {
    const response = await s3.list_bucket();
    if(response)
    res.send(response)
})

s3Router.post('/create/bucket', [auth], async (req, res) => {
    const response = await s3.create_bucket('test')
    if(response)
    res.send(response)
})

s3Router.get('/bucket/objects', [auth], async (req, res) => {
    const {bucket_name} = req.query
    const response = await s3.list_bucket_objects(bucket_name)
    if(response)
    res.send(response)
})

s3Router.get('/bucket/objects/public-url', [auth], async (req, res) => {
    const {bucket_name, file_name, expiry} = req.query;
    const response = await s3.get_public_url(bucket_name, file_name, expiry)
    res.send(response)
})

module.exports = s3Router