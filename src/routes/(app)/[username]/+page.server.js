import { fail } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import UserRepository from '$lib/repositories/user';
import FollowersRepository from '$lib/repositories/followers';
import LikesRepository from '$lib/repositories/likes';
import posts from '$lib/posts';
import { like, follow } from '$lib/actions';

/** @type {import('./$types').Actions} */
export const actions = {
	like,
	follow
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params, platform }) {
	if (platform?.env.DB) {
		const userRepo = new UserRepository({ db: platform.env.DB });
		const postRepo = new PostRepository({ db: platform.env.DB });
		const postEntityRepo = new PostEntityRepository({ db: platform.env.DB });
		const followersRepo = new FollowersRepository({ db: platform.env.DB });
		const likesRepo = new LikesRepository({ db: platform.env.DB });
		const profile = await userRepo.findByUsername(params.username);
		let posts = [];
		let following = [];
		let followers = [];
		let isFollowing = false;
		if (profile) {
			posts = await postRepo.findByUsername(params.username);
			if (locals?.user?.id) {
				isFollowing = await followersRepo.isFollowing({
					followerId: locals.user.id,
					followedId: profile.id
				});
			}
			following = await followersRepo.getFollowing({ userId: profile.id });
			followers = await followersRepo.getFollowers({ userId: profile.id });
			posts = await Promise.all(
				posts.map(async (post) => {
					post.entities = await postEntityRepo.findByPostId(post.id);
					if (post.thread_id && !post.reply_id) {
						const parentPost = await postRepo.findById(post.thread_id);
						if (parentPost) {
							post.thread = parentPost;
							post.thread.liked = await likesRepo.getIsPostLiked({
								postId: post.thread_id,
								userId: locals.user?.id
							});
						}
					}
					if (post.reply_id) {
						const parentPost = await postRepo.findById(post.reply_id);
						if (parentPost) {
							post.reply = parentPost;
						}
					}
					post.liked = await likesRepo.getIsPostLiked({ postId: post.id, userId: locals.user?.id });
					return post;
				})
			);
		}
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
