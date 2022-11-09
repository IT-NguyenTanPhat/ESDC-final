const mailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_MAILER_CLIENT_ID =
	'201932077088-400848s7n8tgdsdt8mqmutnf0m6vmkou.apps.googleusercontent.com';
const GOOGLE_MAILER_CLIENT_SECRET = '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';
const GOOGLE_MAILER_REFRESH_TOKEN =
	'1//04dcyJ7TRP06sCgYIARAAGAQSNwF-L9Ir5ODI6zMGCZzONfiFQkoSqN61HlDUSb7ciGvYNAh4RZ00ghtCZT1J_DtMZaTmEwGgDb4';
const ADMIN_EMAIL_ADDRESS = 'thanh14147@gmail.com';
const ADMIN_NAME = 'Academic Supporting System';

const myOAuth2Client = new OAuth2Client(
	GOOGLE_MAILER_CLIENT_ID,
	GOOGLE_MAILER_CLIENT_SECRET
);

myOAuth2Client.setCredentials({
	refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});

const sendMail = async ({ to, subject, content: html, ...options }) => {
	const accessToken = (await myOAuth2Client.getAccessToken()).token;

	const transport = mailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: ADMIN_EMAIL_ADDRESS,
			clientId: GOOGLE_MAILER_CLIENT_ID,
			clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
			refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
			accessToken,
		},
	});

	const mailOptions = {
		from: {
			name: ADMIN_NAME,
			address: ADMIN_EMAIL_ADDRESS,
		},
		to,
		subject,
		html,
		...options,
	};

	await transport.sendMail(mailOptions);
};

module.exports = { sendMail };
