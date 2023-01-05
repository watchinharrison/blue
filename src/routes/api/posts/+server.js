// @ts-nocheck
import { fail } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, params, platform }) {
	if (!platform?.env.DB) {
		return fail(500, { error: 'No database connection' });
	}
	const postRepo = new PostRepository({ db: platform.env.DB });
	const postEntityRepo = new PostEntityRepository({ db: platform.env.DB });
	const url = new URL(request.url);
	const id = url.searchParams.get('id');
	const post = await postRepo.findById(id);
	post.entities = await postEntityRepo.findByPostId(post.id);
	post.replies = await postRepo.getReplies(post.id);
	if (post.thread_id && !post.reply_id) {
		const parentPost = await postRepo.findById(post.thread_id);
		if (parentPost) {
			post.thread = parentPost;
		}
	}
	if (post.reply_id) {
		const parentPost = await postRepo.findById(post.reply_id);
		if (parentPost) {
			post.reply = parentPost;
		}
	}
	return new Response(JSON.stringify({ post }), { status: 200 });
}
