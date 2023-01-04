// @ts-nocheck
import PostRepository from '$lib/repositories/post';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, platform }) {
	if (!platform?.env.DB) {
		return new Response(JSON.stringify({ error: 'No database connection' }), { status: 500 });
	}
	const postRepo = new PostRepository({ db: platform.env.DB });
	const url = new URL(request.url);
	const body = Object.fromEntries(url.searchParams);
	const replies = await postRepo.getReplies(body.postId);
	return new Response(JSON.stringify({ replies }), { status: 200 });
}
