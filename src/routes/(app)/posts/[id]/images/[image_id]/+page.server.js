import { fail } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import LikesRepository from '$lib/repositories/likes';
import { like } from '$lib/actions';

/** @type {import('./$types').Actions} */
export const actions = {
	like
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ platform, locals, params }) {
	if (!platform?.env.__D1_BETA__DB) {
		return fail(500, { error: 'No database connection' });
	}
	const postRepo = new PostRepository({ db: platform.env.__D1_BETA__DB });
	const postEntityRepo = new PostEntityRepository({ db: platform.env.__D1_BETA__DB });
	const post = await postRepo.findById(params.id);
	const entity = await postEntityRepo.findById(params.image_id);
	return {
		post,
		entity
	};
}
