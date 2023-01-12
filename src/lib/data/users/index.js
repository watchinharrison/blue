import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import UserRepository from '$lib/repositories/user';
import FollowersRepository from '$lib/repositories/followers';
import LikesRepository from '$lib/repositories/likes';

export const getUser = async (options = {}) => {
	const postRepo = new PostRepository({ db: options.platform.env.DB });
	const postEntityRepo = new PostEntityRepository({ db: options.platform.env.DB });
	const followersRepo = new FollowersRepository({ db: options.platform.env.DB });
	const userRepo = new UserRepository({ db: options.platform.env.DB });
	const likesRepo = new LikesRepository({ db: options.platform.env.DB });
	let user;
	if (options.id) {
		user = await userRepo.findById(options.id);
	} else if (options.username) {
		user = await userRepo.findByUsername(options.username);
	}
	const profile = {
		id: user.id,
		display_name: user.display_name,
		username: user.username,
		profile_image_url: user.profile_image_url,
		header_image_url: user.header_image_url,
		bio: user.bio
	};
	let isFollowing = false;
	if (options.locals?.user?.id) {
		isFollowing = await followersRepo.isFollowing({
			followerId: options.locals.user.id,
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
			post.liked = await likesRepo.getIsPostLiked({
				postId: post.id,
				userId: options.locals.user?.id
			});
			return post;
		})
	);

	return {
		profile,
		following,
		followers,
		isFollowing,
		posts
	};
};
