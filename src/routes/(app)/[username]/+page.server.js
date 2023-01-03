import { fail } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import UserRepository from '$lib/repositories/user';
import FollowersRepository from '$lib/repositories/followers';
import posts from '$lib/posts';
import { like } from '$lib/actions';

/** @type {import('./$types').Actions} */
export const actions = {
	like,
	follow: async ({ platform, locals, params }) => {
		if (!platform?.env.DB) {
			return fail(500, { error: 'No database connection' });
		}
		const userRepo = new UserRepository({ db: platform.env.DB });
		const profile = await userRepo.findByUsername(params.username);
		const followersRepo = new FollowersRepository({ db: platform.env.DB });
		const isFollowing = await followersRepo.isFollowing({
			followerId: locals.user.id,
			followedId: profile.id
		});
		if (isFollowing) {
			await followersRepo.delete({ followerId: locals.user.id, followedId: profile.id });
		} else {
			await followersRepo.create({ followerId: locals.user.id, followedId: profile.id });
		}
		return { success: true };
	}
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params, platform }) {
	if (platform?.env.DB) {
		const userRepo = new UserRepository({ db: platform.env.DB });
		const postRepo = new PostRepository({ db: platform.env.DB });
		const postEntityRepo = new PostEntityRepository({ db: platform.env.DB });
		const followersRepo = new FollowersRepository({ db: platform.env.DB });
		let posts = await postRepo.findByUsername(params.username);
		const profile = await userRepo.findByUsername(params.username);
		let isFollowing = false;
		if (locals?.user?.id) {
			isFollowing = await followersRepo.isFollowing({
				followerId: locals.user.id,
				followedId: profile.id
			});
		}
		const following = await followersRepo.getFollowing({ userId: profile.id });
		const followers = await followersRepo.getFollowers({ userId: profile.id });
		posts = await Promise.all(
			posts.map(async (post) => {
				post.entities = await postEntityRepo.findByPostId(post.id);
				return post;
			})
		);
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
