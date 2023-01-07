import { fail, redirect } from '@sveltejs/kit';
import UserRepository from '$lib/repositories/user';

/** @type {import('../../../$types').Actions} */
export const actions = {
	default: async ({ request, platform, locals }) => {
		if (!platform?.env.DB) {
			return fail(500, { error: 'No database connection' });
		}
		const formData = await request.formData();
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const username = formData.get('username');
		const profile_image = formData.get('profileImage');
		let profile_image_url = null;
		if (profile_image) {
			const imageText = await profile_image.arrayBuffer();

			const randomFileName =
				Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

			if (platform?.env.FILE_BUCKET) {
				const fileBucket = platform.env.FILE_BUCKET;
				const object = await fileBucket.put(randomFileName, imageText, {
					httpMetadata: { contentType: profile_image.type }
				});
				if (object) {
					profile_image_url = randomFileName;
				}
			}
		}
		const userRepo = new UserRepository({ db: platform.env.DB });
		await userRepo.update({
			id: locals.user.id,
			first_name: firstName,
			last_name: lastName,
			username,
			profile_image_url
		});

		return { success: true };
	}
};

/** @type {import('../../../$types').PageServerLoad} */
export async function load({ locals }) {
	if (!locals.user?.id) {
		throw redirect(303, '/login');
	}
	return {
		user: locals.user
	};
}
