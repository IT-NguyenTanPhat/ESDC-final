const fs = require('fs');
const image = fs.readFileSync('keyboard.jpg', { encoding: 'base64' });

module.exports = [
	{
		_id: '636ce8a51db82fd56243f59a',
		author: '636b642dea7b88758ed0d54f',
		content: 'Mình cần pass lại bộ vợt này! chỉ 120k thôi nhaaa',
		phones: '0898228317',
		images: [
			`data:image/jpeg;base64, ${image}`,
			`data:image/jpeg;base64, ${image}`,
		],
	},
];
