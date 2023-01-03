import { fail } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import { like } from '$lib/actions';

/** @type {import('./$types').Actions} */
export const actions = {
	like
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ platform, params }) {
	if (!platform?.env.DB) {
		return fail(500, { error: 'No database connection' });
	}
	const postRepo = new PostRepository({ db: platform.env.DB });
	const postEntityRepo = new PostEntityRepository({ db: platform.env.DB });
	const post = await postRepo.findById(params.id);
	post.entities = await postEntityRepo.findByPostId(post.id);
	return {
		post
	};
}
