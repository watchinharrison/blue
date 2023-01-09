// @ts-nocheck
import { fail } from '@sveltejs/kit';
import { getUser } from '$lib/data/users';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, platform }) {
	if (!platform?.env.DB) {
		return fail(500, { error: 'No database connection' });
	}
	const url = new URL(request.url);
	const id = url.searchParams.get('id');
	const { profile, following, followers, isFollowing, posts } = await getUser({
		id,
		locals,
		platform
	});

	return new Response(
		JSON.stringify({
			profile,
			following,
			followers,
			isFollowing,
			posts
		}),
		{ status: 200 }
	);
}
