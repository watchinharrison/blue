// @ts-nocheck
import { getPosts } from '$lib/data/posts';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, platform, request }) {
	let searchResults = [];
	if (request?.url?.match(/term=/)) {
		const term = request.url.match(/term=(.*?)(?:&|$)/)[1];
		searchResults = await getPosts({
			locals,
			platform,
			term
		});
	}

	return {
		user: locals.user,
		results: searchResults
	};
}
