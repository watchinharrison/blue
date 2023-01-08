import he from 'he';

const getTitle = async (body) => {
	const regexPatterns = [
		/<meta(?:\s|\w|-|"|=)+property="og:title"\s+content="([^"]*)"\s*\/>/,
		/<meta(?:\s|\w|-|"|=)+name="twitter:title"\s+content="([^"]*)"\s*\/>/,
		/<title.*>([^<]*)<\/title>/,
		/<h1[^>]*>([^<]*)<\/h1>/
	];
	for (const pattern of regexPatterns) {
		const match = body.match(pattern);
		if (match) {
			return he.decode(match[1]);
		}
	}
};

const getDescription = async (text) => {
	const regexPatterns = [
		/<meta(?:\s|\w|-|"|=)+property="og:description"\s+content="([^"]*)"\s*\/>/,
		/<meta(?:\s|\w|-|"|=)+name="description"\s+content="([^"]*)"\s*\/>/,
		/<meta(?:\s|\w|-|"|=)+name="twitter:description"\s+content="([^"]*)"\s*\/>/
	];
	for (const pattern of regexPatterns) {
		const match = text.match(pattern);
		if (match) {
			return he.decode(match[1]);
		}
	}
};

const getDomain = async (text) => {
	const regexPatterns = [
		/<meta(?:\s|\w|-|"|=)+property="og:site_name"\s+content="([^"]*)"\s*\/>/,
		/<meta(?:\s|\w|-|"|=)+name="twitter:site"\s+content="([^"]*)"\s*\/>/
	];
	for (const pattern of regexPatterns) {
		const match = text.match(pattern);
		if (match) {
			return he.decode(match[1]);
		}
	}
};

const getImage = async (text) => {
	const regexPatterns = [
		/<meta(?:\s|\w|-|"|=)+property="og:image"\s+content="([^"]*)"\s*\/>/,
		/<meta(?:\s|\w|-|"|=)+name="twitter:image"\s+content="([^"]*)"\s*\/>/
	];
	for (const pattern of regexPatterns) {
		const match = text.match(pattern);
		if (match) {
			return he.decode(match[1]);
		}
	}
};

export const getRichPreview = async (uri) => {
	const obj = {
		title: '',
		description: '',
		domain: '',
		image: ''
	};
	const response = await fetch(uri);
	if (response.status !== 200) return null;
	const text = await response.text();
	obj.title = await getTitle(text);
	obj.description = await getDescription(text);
	obj.domain = await getDomain(text);
	obj.image = await getImage(text);
	return obj;
};
