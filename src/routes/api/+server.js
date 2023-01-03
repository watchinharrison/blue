// @ts-nocheck
import PostRepository from '$lib/repositories/post';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, platform }) {
	if (!platform?.env.DB) {
		return {
			status: 500,
			body: {
				error: 'No database connection'
			}
		};
	}
	const likesRepo = new PostRepository({ db: platform.env.DB });
	const path = request.path.replace('/api', '');
	const body = await request.json();
	if (path === '/likes') {
		const { likes_count: likesCount } = await likesRepo.findById(body.postId);
		return {
			body: {
				likes: likesCount
			}
		};
	}

	return {
		body
	};
}
