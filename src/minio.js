require('dotenv').config()
const Minio = require("minio");

const fs = require('fs');
const { reject } = require('bcrypt/promises');

const DEFAULT_EXPIRY = 86400;
const IS_PRODUCTION = JSON.parse(process.env.IS_PRODUCTION);

const credentinals = () => {
    if (IS_PRODUCTION) {
        return {
            accessKey: process.env.ACCESS_KEY,
            secretKey: process.env.SECRET_KEY,
            port: JSON.parse(process.env.MINIO_PORT),
            useSSL: false,
            pathStyle: true,
        }
    }else {
        return {
            accessKey: process.env.ACCESS_KEY,
            secretKey: process.env.SECRET_KEY,
            endPoint: process.env.MINIO_HOST,
            pathStyle: true,
        }
    }
}

// S3 Bucket
const minioClient = new Minio.Client(credentinals());
const bucketName = "second-bucket";


// List all buckets
const list_bucket = async () => {
    console.log(`Listing all buckets...`);
    const bucketsList = await minioClient.listBuckets();
    console.log(
        `Buckets List: ${bucketsList.map((bucket) => bucket.name).join(",\t")}`
    );
    return bucketsList
};

// Upload file
const upload_file = async (filename, file) => {
    // create object from file data
    const submitFileDataResult = await minioClient
        .putObject(bucketName, filename, file)
        .catch((e) => {
            console.log("Error while creating object from file data: ", e);
            throw e;
        });
    console.log("File data submitted successfully: ", submitFileDataResult);
    return submitFileDataResult
};

// Create new bucket in server
const create_bucket = async (bucketName) => {
    console.log(`Creating Bucket: ${bucketName}`);
    const response = await minioClient.makeBucket(bucketName, "hello-there").catch((e) => {
        console.log(
            `Error while creating bucket '${bucketName}': ${e.message}`
        );
    });
    return response
}

// List all object/files into bucket
let list_bucket_objects = function (bucketName) {
    return new Promise((resolve, reject) => {
        const objectsListTemp = [];
        const stream = minioClient.listObjectsV2(bucketName, '', true, '');

        stream.on('data', obj => objectsListTemp.push(obj));
        stream.on('error', reject);
        stream.on('end', () => {
            resolve(objectsListTemp);
        });
    })
}

const get_public_url = async (bucketName, fileName, expiry) => {
    const response = {}
    if(expiry){
        expiry =  Number.parseInt(expiry)
        const url = await minioClient.presignedGetObject(bucketName, fileName, expiry);
        return {public_url: url, expiry: expiry}
    }else {
        const url = await minioClient.presignedGetObject(bucketName, fileName, DEFAULT_EXPIRY);
        return {public_url: url, expiry: DEFAULT_EXPIRY}
    }
} 

module.exports = { upload_file, list_bucket, create_bucket, list_bucket_objects, get_public_url };