// @ts-nocheck
import jwt from '@tsndr/cloudflare-worker-jwt';
import { AUTH_SECRET } from '$env/static/private';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const BlueAuthorization = event.cookies.get('Blue_Authorization');

	async function fetchUserDetails(payload) {
		const ps = event.platform.env.DB.prepare(
			'SELECT id, first_name, last_name, username, profile_image_url FROM users WHERE id = ?'
		);
		return ps
			.bind(payload.id)
			.first()
			.catch((error) => {
				console.log('error', error);
				return {};
			});
	}

	if (BlueAuthorization) {
		const verified = await jwt.verify(BlueAuthorization, AUTH_SECRET);
		if (verified) {
			const { payload } = jwt.decode(BlueAuthorization);
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
