// @ts-nocheck
import jwt from '@tsndr/cloudflare-worker-jwt';
import { AUTH_SECRET } from '$env/static/private';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const BluAuthorization = event.cookies.get('Blu_Authorization');

	async function fetchUserDetails(payload) {
		const ps = event.platform.env.DB.prepare(
			'SELECT id, display_name, username, profile_image_url FROM users WHERE id = ?'
		);
		return ps
			.bind(payload.id)
			.first()
			.catch((error) => {
				console.log('error', error);
				return {};
			});
	}

	if (BluAuthorization) {
		const verified = await jwt.verify(BluAuthorization, AUTH_SECRET);
		if (verified) {
			const { payload } = jwt.decode(BluAuthorization);
			if (payload) {
				const userData = await fetchUserDetails(payload);
				if (userData) {
					event.locals.user = userData;
				}
			}
		}
	}

	const response = await resolve(event);
	return response;
}
