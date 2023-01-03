import { fail, redirect } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import LikesRepository from '$lib/repositories/likes';

export const like = async ({ platform, locals, params, request }) => {
	if (!platform?.env.DB) {
		return fail(500, { error: 'No database connection' });
	}
	if (!locals?.user?.id) {
		return fail(401, { error: 'Unauthorized' });
	}
	const data = await request.formData();
	const postId = data.get('post_id');
	const postRepo = new PostRepository({ db: platform.env.DB });
	const likesRepo = new LikesRepository({ db: platform.env.DB });
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
