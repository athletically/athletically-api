
const AWS = require('aws-sdk');
const appConfig = require('../../config/appConfig');
// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const putFileUrl = (key) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Expires: appConfig.urlExpTime             
        };
        s3.getSignedUrl('putObject',params,(err,url) => {
            if(err){
                reject(err);
            }else{
                resolve(url);
            }
        })
    });
};

const getFileUrl = (key) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Expires: appConfig.urlExpTime             
        };
        s3.getSignedUrl('getObject',params,(err,url) => {
            if(err){
                reject(err);
            }else{
                resolve(url);
            }
        })
    });
};

module.exports = {
    putFileUrl: putFileUrl,
    getFileUrl: getFileUrl
}