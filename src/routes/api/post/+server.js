// @ts-nocheck
import { fail } from '@sveltejs/kit';
import { getPost } from '$lib/data/posts';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, platform }) {
	if (!platform?.env.DB) {
		return fail(500, { error: 'No database connection' });
	}
	const url = new URL(request.url);
	const id = url.searchParams.get('id');
	const post = await getPost({ id, locals, platform });

	return new Response(JSON.stringify({ post }), { status: 200 });
}
