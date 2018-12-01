const AWS = require('aws-sdk');

AWS.config.update({accessKeyId: process.env.S3_ID});
AWS.config.update({secretAccessKey: process.env.S3_KEY});
AWS.config.update({region: 'us-east-1'});

const s3 = new AWS.S3();

const bucketName = 'split-view';

module.exports = {
    s3: s3,

    uploadToCloud: function(file) {
        if (!file && !file.name && !file.data) {
            return null;
        }

        const key = new Date().getTime() + file.name;
        
        params = {
            Bucket: bucketName,
            ACL: 'public-read',
            Key: key,
            Body: file.data
        };

        return s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err);
                return null;
            } else {
                return key;        
            }
        });

    },

    deleteFromCloud: function(key) {
        params = {
            Bucket: bucketName,
            Key: key
        };

        return s3.deleteObject(params, function(err, data) {
            if (err) {
                console.log(err);
                return false;
            } else {
                return true;        
            }
        });
    }

};