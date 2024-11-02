var nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.OAUTH_REFRESH_TOKEN;

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: emailUser,
		clientId: clientId,
		clientSecret: clientSecret,
		refreshToken: refreshToken,
	},
});

interface EmailOptions {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
	const mailOptions = {
		from: emailUser,
		to,
		subject,
		text,
		html,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		return info;
	} catch (error) {
		console.error('Error sending email:', error);
		throw error;
	}
};
