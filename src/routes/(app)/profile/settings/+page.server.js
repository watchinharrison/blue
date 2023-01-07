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
		const header_image = formData.get('headerImage');
		let profile_image_url = null;
		let header_image_url = null;
		if (profile_image && profile_image.size > 0) {
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
		if (header_image && header_image.size > 0) {
			const imageText = await header_image.arrayBuffer();

			const randomFileName =
				Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

			if (platform?.env.FILE_BUCKET) {
				const fileBucket = platform.env.FILE_BUCKET;
				const object = await fileBucket.put(randomFileName, imageText, {
					httpMetadata: { contentType: header_image.type }
				});
				if (object) {
					header_image_url = randomFileName;
				}
			}
		}
		const userRepo = new UserRepository({ db: platform.env.DB });
		await userRepo.update({
			id: locals.user.id,
			first_name: firstName,
			last_name: lastName,
			username,
			profile_image_url,
			header_image_url
		});

		return { success: true };
	}
};

/** @type {import('../../../$types').PageServerLoad} */
export async function load({ platform, locals }) {
	if (!locals.user?.id) {
		throw redirect(303, '/login');
	}
	const userRepo = new UserRepository({ db: platform.env.DB });
	const user = await userRepo.findById(locals.user.id);
	const profile = {
		first_name: user.first_name,
		last_name: user.last_name,
		username: user.username,
		profile_image_url: user.profile_image_url,
		header_image_url: user.header_image_url
	};
	return {
		user: locals.user,
		profile
	};
}
