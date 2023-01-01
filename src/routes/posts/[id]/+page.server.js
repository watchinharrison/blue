import { fail } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';

/** @type {import('./$types').PageServerLoad} */
export async function load({ platform, params }) {
	if (!platform?.env.DB) {
		return fail(500, { error: 'No database connection' });
	}
	const postRepo = new PostRepository({ db: platform.env.DB });
	const post = await postRepo.findById(params.id);
	return {
		post
	};
}
