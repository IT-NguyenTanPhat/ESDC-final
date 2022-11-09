const { createClient } = require('redis');

let redisClient;

(async () => {
	redisClient = createClient({
		socket: {
			host: 'redis-11913.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
			port: '11913',
		},
		password: 'rbKbPoFjlOYY8sYnD5Fz4lcPXBVFxxui',
	});

	redisClient.on('error', (err) => {
		console.log(err);
	});

	redisClient.on('connect', () => {
		console.log('redis connected');
	});

	await redisClient.connect();
})();

module.exports = redisClient;
