require('dotenv').config()
const Minio = require("minio");

const fs = require('fs');
const { reject } = require('bcrypt/promises');

// S3 Bucket
const minioClient = new Minio.Client({
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
    endPoint: process.env.MINIO_HOST,
    pathStyle: true,
});
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

const create_bucket = async (bucketName) => {
    console.log(`Creating Bucket: ${bucketName}`);
    const response = await minioClient.makeBucket(bucketName, "hello-there").catch((e) => {
        console.log(
            `Error while creating bucket '${bucketName}': ${e.message}`
        );
    });
    return response
}


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

module.exports = { upload_file, list_bucket, create_bucket, list_bucket_objects };