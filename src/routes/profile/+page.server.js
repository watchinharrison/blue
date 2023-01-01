import { fail, redirect } from '@sveltejs/kit';
import UserRepository from '$lib/repositories/user';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, platform, locals }) => {
		if (!platform?.env.DB) {
			return fail(500, { error: 'No database connection' });
		}
		const formData = await request.formData();
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const username = formData.get('username');
		const userRepo = new UserRepository({ db: platform.env.DB });
		await userRepo.update({
			id: locals.user.id,
			first_name: firstName,
			last_name: lastName,
			username
		});

		locals.user.first_name = firstName;
		locals.user.last_name = lastName;
		locals.user.username = username;

		return { success: true };
	}
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (!locals.user?.email) {
		throw redirect(303, '/login');
	}
	return {
		user: locals.user
	};
}
