import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			callbackURL: '/auth/google/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			if (!profile.emails || profile.emails.length === 0) {
				return done(new Error('No email found'), false);
			}

			const email = profile.emails[0].value;
			const photo =
				profile.photos && profile.photos.length > 0
					? profile.photos[0].value
					: null;
			const user = {
				id: profile.id,
				displayName: profile.displayName,
				emails: profile.emails,
				photo: photo,
			};

			if (email && email.endsWith('@hyderabad.bits-pilani.ac.in')) {
				return done(null, user);
			} else {
				return done(new Error('Unauthorized'), false);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user as Express.User);
});
