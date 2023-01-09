// @ts-nocheck
import { getPosts } from '$lib/data/posts';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, platform }) {
	let searchResults = [];
	console.log('locals', locals);
	if (locals.term) {
		searchResults = await getPosts({ locals, platform, term: locals.term });
	}

	return {
		user: locals.user,
		results: searchResults
	};
}
