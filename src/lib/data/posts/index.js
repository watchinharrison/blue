import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import LikesRepository from '$lib/repositories/likes';

export const getPosts = async (options = {}) => {
	const postRepo = new PostRepository({ db: options.platform.env.__D1_BETA__DB });
	const postEntityRepo = new PostEntityRepository({ db: options.platform.env.__D1_BETA__DB });
	const likesRepo = new LikesRepository({ db: options.platform.env.__D1_BETA__DB });
	let posts = [];
	if (options.term) {
		posts = await postRepo.search(options.term);
	} else if (options.thread_id) {
		posts = await postRepo.findByThreadId(options.thread_id);
	} else if (options.locals.user) {
		posts = await postRepo.findByFollowers(options.locals.user.id);
	} else {
		posts = await postRepo.findAll();
	}
	return Promise.all(
		posts.map(async (post) => {
			post.entities = await postEntityRepo.findByPostId(post.id);
			post.replies = await postRepo.getReplies(post.id);
			post.replies = await Promise.all(
				post.replies.map(async (reply) => {
					reply.thread_count = await postRepo.getThreadCount(reply.reply_id);
					return reply;
				})
			);
			post.likes = await likesRepo.getLikes({ postId: post.id });
			post.reposts = await postRepo.getReposts(post.id);
			post.liked = await likesRepo.getIsPostLiked({
				postId: post.id,
				userId: options.locals.user?.id
			});
			if (post.thread_id && !post.reply_id) {
				const parentPost = await postRepo.findById(post.thread_id);
				parentPost.entities = await postEntityRepo.findByPostId(post.thread_id);
				if (parentPost) {
					post.thread = parentPost;
					post.thread.liked = await likesRepo.getIsPostLiked({
						postId: post.thread_id,
						userId: options.locals.user?.id
					});
				}
			}
			if (post.reply_id) {
				const parentPost = await postRepo.findById(post.reply_id);
				if (parentPost) {
					post.reply = parentPost;
				}
			}
			return post;
		})
	);
};

export const getPost = async (options = {}) => {
	const postRepo = new PostRepository({ db: options.platform.env.__D1_BETA__DB });
	const postEntityRepo = new PostEntityRepository({ db: options.platform.env.__D1_BETA__DB });
	const likesRepo = new LikesRepository({ db: options.platform.env.__D1_BETA__DB });
	const post = await postRepo.findById(options.id);
	post.entities = await postEntityRepo.findByPostId(post.id);
	post.replies = await postRepo.getReplies(post.id);
	post.replies = await Promise.all(
		post.replies.map(async (reply) => {
			reply.thread_count = await postRepo.getThreadCount(reply.reply_id);
			return reply;
		})
	);
	post.likes = await likesRepo.getLikes({ postId: post.id });
	post.reposts = await postRepo.getReposts(post.id);
	post.liked = await likesRepo.getIsPostLiked({ postId: post.id, userId: options.locals.user?.id });
	if (post.thread_id && !post.reply_id) {
		const parentPost = await postRepo.findById(post.thread_id);
		parentPost.entities = await postEntityRepo.findByPostId(post.thread_id);
		if (parentPost) {
			post.thread = parentPost;
			post.thread.liked = await likesRepo.getIsPostLiked({
				postId: post.thread_id,
				userId: options.locals.user?.id
			});
		}
	}
	if (post.reply_id) {
		const parentPost = await postRepo.findById(post.reply_id);
		if (parentPost) {
			post.reply = parentPost;
		}
	}
	return post;
};
