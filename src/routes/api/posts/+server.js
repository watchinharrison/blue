// @ts-nocheck
import { fail } from '@sveltejs/kit';
import { getPosts } from '$lib/data/posts';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, platform }) {
	if (!platform?.env.__D1_BETA__DB) {
		return fail(500, { error: 'No database connection' });
	}
	const url = new URL(request.url);
	const thread_id = url.searchParams.get('thread_id');
	const term = url.searchParams.get('term');
	const posts = await getPosts({ thread_id, locals, term, platform });
	return new Response(JSON.stringify({ posts }), { status: 200 });
}
