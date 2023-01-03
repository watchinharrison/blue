// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import UserRepository from '$lib/repositories/user';
import FollowersRepository from '$lib/repositories/followers';
import LikesRepository from '$lib/repositories/likes';
import posts from '$lib/posts';
import { like } from '$lib/actions';

/** @type {import('../$types').Actions} */
export const actions = {
	logout: async (event) => {
		event.cookies.delete('Blue_Authorization');
		event.locals.user = null;
		return { success: true };
	},
	like,
	post: async ({ request, url, platform, cookies, locals }) => {
		if (!platform?.env.DB) {
			return fail(500, { error: 'No database connection' });
		}
		const referer = request.headers.get('referer');
		const refererUrl = new URL(referer);
		const postRepo = new PostRepository({ db: platform.env.DB });
		const postEntityRepo = new PostEntityRepository({ db: platform.env.DB });
		const data = await request.formData();
		const text = data.get('text');
		const postId = data.get('post_id');
		const images = data.getAll('image');
		const newPost = await postRepo.create({ text, user_id: locals.user.id });
		if (newPost) {
			const newPostId = newPost.lastRowId;
			await Promise.all(
				images
					.filter((image) => image.size)
					.map(async (image) => {
						const imageText = await image.arrayBuffer();

						const randomFileName =
							Math.random().toString(36).substring(2, 15) +
							Math.random().toString(36).substring(2, 15);

						if (platform?.env.FILE_BUCKET) {
							const fileBucket = platform.env.FILE_BUCKET;
							const object = await fileBucket.put(randomFileName, imageText, {
								httpMetadata: { contentType: image.type }
							});
							if (object) {
								await postEntityRepo.create({
									post_id: newPostId,
									type: 'media',
									url: randomFileName,
									entity_type: 'image'
								});
							}
						}
					})
			);
			if (refererUrl.pathname !== '/') {
				throw redirect(303, '/');
			}
		}
		return { success: true };
	}
};

/** @type {import('../$types').PageServerLoad} */
export async function load({ locals, platform }) {
	if (platform?.env.DB) {
		const postRepo = new PostRepository({ db: platform.env.DB });
		const postEntityRepo = new PostEntityRepository({ db: platform.env.DB });
		new UserRepository({ db: platform.env.DB }).setupTable();
		new FollowersRepository({ db: platform.env.DB }).setupTable();
		postRepo.setupTable();
		postEntityRepo.setupTable();
		let posts = [];
		if (locals.user) {
			posts = await postRepo.findByFollowers(locals.user.id);
		} else {
			posts = await postRepo.findAll();
		}
		posts = await Promise.all(
			posts.map(async (post) => {
				post.entities = await postEntityRepo.findByPostId(post.id);
				return post;
			})
		);
		return {
			user: locals.user,
			posts
		};
	}

	return {
		user: locals.user,
		posts
	};
}
