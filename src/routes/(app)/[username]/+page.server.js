import posts from '$lib/posts';
import { like, follow } from '$lib/actions';
import { getUser } from '$lib/data/users';

/** @type {import('./$types').Actions} */
export const actions = {
	like,
	follow
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params, platform }) {
	if (platform?.env.DB) {
		const { profile, following, followers, isFollowing, posts } = await getUser({
			username: params.username,
			locals,
			platform
		});
		return {
			user: locals.user,
			profile,
			following,
			followers,
			isFollowing,
			posts
		};
	}

	return {
		user: locals.user,
		profile: {},
		posts
	};
}
