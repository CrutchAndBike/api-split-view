const AWS = require('aws-sdk');

AWS.config.update({ accessKeyId: process.env.S3_ID });
AWS.config.update({ secretAccessKey: process.env.S3_KEY });
AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();

const bucketName = 'split-view';

module.exports = {
	s3: s3,

	uploadToCloud: function (file) {
		if (!file && !file.name && !file.data) {
			return null;
		}

		const key = new Date().getTime() + file.name;

		const params = {
			Bucket: bucketName,
			ACL: 'public-read',
			Key: key,
			Body: file.data
		};

		s3.putObject(params, function (err) {
			if (err) {
				console.log(err);
			}
		});

		return key;
	},

	deleteFromCloud: function (key) {
		const params = {
			Bucket: bucketName,
			Key: key
		};

		s3.deleteObject(params, function (err) {
			if (err) {
				console.log(err);
			}
		});
	}

};