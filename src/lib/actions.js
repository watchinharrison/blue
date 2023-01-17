import { fail, redirect } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import LikesRepository from '$lib/repositories/likes';
import UserRepository from '$lib/repositories/user';
import FollowersRepository from '$lib/repositories/followers';

export const like = async ({ platform, locals, params, request }) => {
	if (!platform?.env.__D1_BETA__DB) {
		return fail(500, { error: 'No database connection' });
	}
	if (!locals?.user?.id) {
		return fail(401, { error: 'Unauthorized' });
	}
	const data = await request.formData();
	const postId = data.get('post_id');
	const postRepo = new PostRepository({ db: platform.env.__D1_BETA__DB });
	const likesRepo = new LikesRepository({ db: platform.env.__D1_BETA__DB });
	await likesRepo.setupTable();
	const post = await postRepo.findById(postId);
	if (post) {
		const isLiked = await likesRepo.getIsPostLiked({ userId: locals.user.id, postId: post.id });
		if (isLiked) {
			await likesRepo.delete({ userId: locals.user.id, postId: post.id });
			await postRepo.removeLike(post.id);
		} else {
			await likesRepo.create({ userId: locals.user.id, postId: post.id });
			await postRepo.addLike(post.id);
		}
		return { success: true, isLiked: !isLiked };
	}
	return fail(404, { error: 'Post not found' });
};

export const follow = async ({ platform, locals, request }) => {
	if (!platform?.env.__D1_BETA__DB) {
		return fail(500, { error: 'No database connection' });
	}
	const data = await request.formData();
	// @TODO: validate text
	const username = data.get('username');
	const userRepo = new UserRepository({ db: platform.env.__D1_BETA__DB });
	const profile = await userRepo.findByUsername(username);
	const followersRepo = new FollowersRepository({ db: platform.env.__D1_BETA__DB });
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
};
