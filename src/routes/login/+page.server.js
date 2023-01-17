import { fail, redirect } from '@sveltejs/kit';
import jwt from '@tsndr/cloudflare-worker-jwt';
import UserRepository from '$lib/repositories/user';
import { AUTH_SECRET } from '$env/static/private';

const hash = async (password) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hash = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hash));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
};

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ request, url, platform, cookies, locals }) => {
		if (!platform?.env.__D1_BETA__DB) {
			return fail(500, { error: 'No database connection' });
		}
		const userRepo = new UserRepository({ db: platform.env.__D1_BETA__DB });

		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		// @TODO: validate email and password;

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const user = await userRepo.findByEmail(email);

		const hashedPassword = await hash(password);

		if (!user || user.password !== hashedPassword) {
			return fail(400, { email, incorrect: true });
		}

		const token = await jwt.sign({ id: user.id }, AUTH_SECRET);

		cookies.set('Blu_Authorization', token);

		locals.user = user;

		return { success: true };
	},
	register: async ({ platform, request, cookies, locals }) => {
		if (!platform?.env.__D1_BETA__DB) {
			return fail(500, { error: 'No database connection' });
		}
		const userRepo = new UserRepository({ db: platform.env.__D1_BETA__DB });
		// TODO register the user
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		// @TODO: validate email and password;

		const username = email.split('@')[0];

		const hashedPassword = await hash(password);
		const newUser = await userRepo.create({ email, password: hashedPassword, username });
		let user;
		if (newUser) {
			user = await userRepo.findById(newUser.lastRowId);
			if (user) {
				const token = await jwt.sign({ id: user.id }, AUTH_SECRET);

				cookies.set('Blu_Authorization', token);
				locals.user = user;
				throw redirect(303, '/profile/settings');
			}
			return {
				success: !!user,
				user
			};
		}
		return {
			success: !!user,
			user
		};
	}
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (locals.user) {
		throw redirect(303, '/');
	}
	return {
		user: locals.user
	};
}
