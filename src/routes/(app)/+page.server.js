// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import PostRepository from '$lib/repositories/post';
import PostEntityRepository from '$lib/repositories/post_entity';
import UserRepository from '$lib/repositories/user';
import FollowersRepository from '$lib/repositories/followers';
import LikesRepository from '$lib/repositories/likes';
import posts from '$lib/posts';
import { like, follow } from '$lib/actions';
import { getRichPreview } from '$lib/server/rich-preview';
import { getPosts } from '$lib/data/posts';

function dataURItoBlob(dataurl) {
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

function fetchImage(image, url) {
	let newImage = image;
	if (image.startsWith('/')) {
		newImage = `${url}${image}`;
	}
	return fetch(newImage).then((response) => response.blob());
}

/** @type {import('../$types').Actions} */
export const actions = {
	logout: async (event) => {
		event.cookies.delete('Blu_Authorization');
		event.locals.user = null;
		return { success: true };
	},
	search: async ({ request, locals }) => {
		// const data = await request.formData();
		const term = request.query.get('term');

		// @TODO: validate term
		console.log('term', term);

		locals.term = term;

		return { success: true, term };
	},
	repost: async ({ request, url, platform, cookies, locals }) => {
		if (!platform?.env.__D1_BETA__DB) {
			return fail(500, { error: 'No database connection' });
		}
		const referer = request.headers.get('referer');
		const refererUrl = new URL(referer);
		const postRepo = new PostRepository({ db: platform.env.__D1_BETA__DB });
		const postEntityRepo = new PostEntityRepository({ db: platform.env.__D1_BETA__DB });
		const data = await request.formData();
		// @TODO: validate text
		const text = data.get('text') ?? '';
		const postId = data.get('post_id');
		const images = data.getAll('image');
		const newPost = await postRepo.create({
			text,
			user_id: locals.user.id,
			thread_id: postId
		});
		if (newPost) {
			if (postId) {
				await postRepo.addRepost(postId);
			}
			const newPostId = newPost.lastRowId;
			await Promise.all(
				images
					.filter((image) => image.size)
					.map(async (image) => {
						const imageText = await image.arrayBuffer();
						const type = image.type;

						const randomFileName =
							Math.random().toString(36).substring(2, 15) +
							Math.random().toString(36).substring(2, 15);

						if (platform?.env.FILE_BUCKET) {
							const fileBucket = platform.env.FILE_BUCKET;
							const object = await fileBucket.put(randomFileName, imageText, {
								httpMetadata: { contentType: type }
							});
							if (object) {
								await postEntityRepo.create({
									post_id: newPostId,
									type: 'media',
									url: randomFileName,
									entity_type: type
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
	},
	like,
	follow,
	post: async ({ request, url, platform, cookies, locals }) => {
		if (!platform?.env.__D1_BETA__DB) {
			return fail(500, { error: 'No database connection' });
		}
		const referer = request.headers.get('referer');
		const refererUrl = new URL(referer);
		const postRepo = new PostRepository({ db: platform.env.__D1_BETA__DB });
		const postEntityRepo = new PostEntityRepository({ db: platform.env.__D1_BETA__DB });
		const data = await request.formData();

		// @TODO: validate text
		const text = data.get('text');
		const postId = data.get('post_id');
		const threadId = data.get('thread_id');
		const images = data.getAll('image');
		const dimensions = data.getAll('dimensions');
		const thumbnails = data.getAll('thumbnails');
		const newPost = await postRepo.create({
			text,
			user_id: locals.user.id,
			reply_id: postId,
			thread_id: threadId
		});
		if (newPost) {
			if (postId) {
				await postRepo.addReply(postId);
			}
			if (threadId && !postId) {
				await postRepo.addRepost(threadId);
			}
			const newPostId = newPost.lastRowId;
			await Promise.all(
				images
					.filter((image) => image.size)
					.map(async (image, index) => {
						const type = image.type;
						const { height, width } = JSON.parse(dimensions[index]);
						let thumbnail_url;
						if (type.match(/video/)) {
							const thumbnailUri = thumbnails[index];
							if (thumbnailUri) {
								const thumbnailBlob = dataURItoBlob(thumbnailUri);
								const thumbnailType = thumbnailBlob.type;
								const thumbnailText = await thumbnailBlob.arrayBuffer();

								const randomThumbnailName =
									Math.random().toString(36).substring(2, 15) +
									Math.random().toString(36).substring(2, 15);
								if (platform?.env.FILE_BUCKET) {
									const fileBucket = platform.env.FILE_BUCKET;
									const thumbnailObject = await fileBucket.put(randomThumbnailName, thumbnailText, {
										httpMetadata: { contentType: thumbnailType }
									});
									if (thumbnailObject) {
										thumbnail_url = randomThumbnailName;
									}
								}
							}
						}
						const imageText = await image.arrayBuffer();

						const randomFileName =
							Math.random().toString(36).substring(2, 15) +
							Math.random().toString(36).substring(2, 15);

						if (platform?.env.FILE_BUCKET) {
							const fileBucket = platform.env.FILE_BUCKET;
							const object = await fileBucket.put(randomFileName, imageText, {
								httpMetadata: { contentType: type }
							});
							if (object) {
								await postEntityRepo.create({
									post_id: newPostId,
									type: 'media',
									url: randomFileName,
									entity_type: type,
									height,
									width,
									thumbnail_url
								});
							}
						}
					})
			);

			if (text && text.match(/https?:\/\/[^\s]+/)) {
				const hrefs = text.match(/https?:\/\/[^\s]+/g);
				await Promise.all(
					hrefs.map(async (href) => {
						const richPreview = await getRichPreview(href);
						if (richPreview && richPreview.title) {
							const { title, description, domain, image, url } = richPreview;
							let thumbnail_url;
							let startIndex = text.indexOf(href);
							const indices = JSON.stringify([startIndex, startIndex + href.length]);
							if (image) {
								const randomThumbnailName =
									Math.random().toString(36).substring(2, 15) +
									Math.random().toString(36).substring(2, 15);
								const imageFromFetch = await fetchImage(
									image.replace(/&amp;/g, '&'),
									href.match(/https?:\/\/[^/]+/)[0]
								);
								const imageType = imageFromFetch.type;
								const imageText = await imageFromFetch.arrayBuffer();
								if (platform?.env.FILE_BUCKET) {
									const fileBucket = platform.env.FILE_BUCKET;
									const thumbnailObject = await fileBucket.put(randomThumbnailName, imageText, {
										httpMetadata: { contentType: imageType }
									});
									if (thumbnailObject) {
										thumbnail_url = randomThumbnailName;
									}
								}
							}
							await postEntityRepo.create({
								post_id: newPostId,
								type: 'rich_preview',
								url: url || href,
								title,
								description,
								site_name: domain,
								thumbnail_url,
								indices
							});
						}
					})
				);
			}
			if (refererUrl.pathname !== '/') {
				throw redirect(303, '/');
			}
		}
		return { success: true };
	}
};

/** @type {import('../$types').PageServerLoad} */
export async function load({ locals, platform, request }) {
	if (platform?.env.__D1_BETA__DB) {
		const postRepo = new PostRepository({ db: platform.env.__D1_BETA__DB });
		const postEntityRepo = new PostEntityRepository({ db: platform.env.__D1_BETA__DB });
		new UserRepository({ db: platform.env.__D1_BETA__DB }).setupTable();
		new FollowersRepository({ db: platform.env.__D1_BETA__DB }).setupTable();
		const likesRepo = new LikesRepository({ db: platform.env.__D1_BETA__DB });
		likesRepo.setupTable();
		postRepo.setupTable();
		postEntityRepo.setupTable();
		const posts = await getPosts({ locals, platform });
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
