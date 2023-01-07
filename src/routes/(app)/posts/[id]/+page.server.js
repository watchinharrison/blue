import { fail } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import LikesRepository from '$lib/repositories/likes';
import { like } from '$lib/actions';

/** @type {import('./$types').Actions} */
export const actions = {
	like
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ platform, locals, params }) {
	if (!platform?.env.DB) {
		return fail(500, { error: 'No database connection' });
	}
	const postRepo = new PostRepository({ db: platform.env.DB });
	const postEntityRepo = new PostEntityRepository({ db: platform.env.DB });
	const likesRepo = new LikesRepository({ db: platform.env.DB });
	const post = await postRepo.findById(params.id);
	post.entities = await postEntityRepo.findByPostId(post.id);
	post.replies = await postRepo.getReplies(post.id);
	post.liked = await likesRepo.getIsPostLiked({ postId: post.id, userId: locals.user?.id });
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
	return {
		post
	};
}
