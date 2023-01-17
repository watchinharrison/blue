import { fail } from '@sveltejs/kit';
import { like } from '$lib/actions';
import { getPost } from '$lib/data/posts';

/** @type {import('./$types').Actions} */
export const actions = {
	like
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ platform, locals, params }) {
	if (!platform?.env.__D1_BETA__DB) {
		return fail(500, { error: 'No database connection' });
	}
	const post = getPost({ platform, locals, id: params.id });
	return {
		post
	};
}
