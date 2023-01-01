// @ts-nocheck

/** @type {import('../$types').RequestHandler} */
export async function GET({ params, platform }) {
	const key = params.key;

	if (platform?.env.FILE_BUCKET) {
		const fileBucket = platform.env.FILE_BUCKET;
		const object = await fileBucket.get(key);

		if (object) {
			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set('etag', object.httpEtag);

			return new Response(object.body, {
				headers
			});
		}
	}
	return new Response('Not Found', {
		status: 404
	});
}
