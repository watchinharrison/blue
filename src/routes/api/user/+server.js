// @ts-nocheck
import { fail } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import UserRepository from '$lib/repositories/user';
import FollowersRepository from '$lib/repositories/followers';
import LikesRepository from '$lib/repositories/likes';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, platform }) {
	if (!platform?.env.DB) {
		return fail(500, { error: 'No database connection' });
	}
	const postRepo = new PostRepository({ db: platform.env.DB });
	const postEntityRepo = new PostEntityRepository({ db: platform.env.DB });
	const followersRepo = new FollowersRepository({ db: platform.env.DB });
	const userRepo = new UserRepository({ db: platform.env.DB });
	const likesRepo = new LikesRepository({ db: platform.env.DB });
	const url = new URL(request.url);
	const id = url.searchParams.get('id');
	const user = await userRepo.findById(id);
	const profile = {
		id: user.id,
		name: `${user.first_name} ${user.last_name}`,
		username: user.username,
		profile_image_url: user.profile_image_url,
		header_image_url: user.header_image_url
	};
	let isFollowing = false;
	if (locals?.user?.id) {
		isFollowing = await followersRepo.isFollowing({
			followerId: locals.user.id,
			followedId: profile.id
		});
	}
	const following = await followersRepo.getFollowing({ userId: profile.id });
	const followers = await followersRepo.getFollowers({ userId: profile.id });
	let posts = await postRepo.findByUserId(user.id);
	posts = await Promise.all(
		posts.map(async (post) => {
			post.entities = await postEntityRepo.findByPostId(post.id);
			post.replies = await postRepo.getReplies(post.id);
			if (post.thread_id && !post.reply_id) {
				const parentPost = await postRepo.findById(post.thread_id);
				parentPost.entities = await postEntityRepo.findByPostId(post.thread_id);
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
