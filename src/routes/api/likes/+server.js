// @ts-nocheck
import PostRepository from '$lib/repositories/post';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, platform }) {
	if (!platform?.env.DB) {
		return new Response(JSON.stringify({ error: 'No database connection' }), { status: 500 });
	}
	const postRepo = new PostRepository({ db: platform.env.DB });
	const path = request.url.pathname;
	const url = new URL(request.url);
	const body = Object.fromEntries(url.searchParams);
	if (path === '/api/likes') {
		const { likes_count: likesCount } = await postRepo.findById(body.postId);
		return new Response(JSON.stringify({ likes: likesCount }), { status: 200 });
	}
	return new Response(
		JSON.stringify({
			likes: 0
		})
	);
}
