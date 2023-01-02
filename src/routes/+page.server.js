// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import posts from '$lib/posts';

/** @type {import('./$types').Actions} */
export const actions = {
	logout: async (event) => {
		event.cookies.delete('Blue_Authorization');
		event.locals.user = null;
		return { success: true };
	},
	post: async ({ request, url, platform, cookies, locals }) => {
		if (!platform?.env.DB) {
			return fail(500, { error: 'No database connection' });
		}
		const postRepo = new PostRepository({ db: platform.env.DB });
		const postEntityRepo = new PostEntityRepository({ db: platform.env.DB });
		const data = await request.formData();
		const text = data.get('text');
		const image = data.get('image');
		// Get the text value of the file:
		const imageText = await image.text();

		const randomFileName =
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

		const newPost = await postRepo.create({ text, user_id: locals.user.id });
		const newPostId = newPost.lastRowId;

		if (platform?.env.FILE_BUCKET) {
			const fileBucket = platform.env.FILE_BUCKET;
			const object = await fileBucket.put(randomFileName, imageText);
			if (object) {
				await postEntityRepo.create({
					post_id: newPostId,
					type: 'media',
					url: randomFileName,
					entity_type: 'image'
				});
			}
		}
		return { success: true };
	}
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, platform }) {
	if (platform?.env.DB) {
		const postRepo = new PostRepository({ db: platform.env.DB });
		const postEntityRepo = new PostEntityRepository({ db: platform.env.DB });
		let posts = await postRepo.findAll();
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
