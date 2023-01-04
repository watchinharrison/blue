export function typewriter(node, { speed = 1, delay = 0 }) {
	const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

	if (!valid) {
		throw new Error(`This transition only works on elements with a single text node child`);
	}

	const text = node.textContent;
	const duration = text.length / (speed * 0.01);

	return {
		delay,
		duration,
		tick: (t) => {
			const i = Math.trunc(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};
}

export function whoosh(node, params) {
	const existingTransform = getComputedStyle(node).transform.replace('none', '');

	return {
		delay: params.delay || 0,
		duration: params.duration || 400,
		css: (t, u) => {
			const x = params.reverse ? t * 300 - 300 : 300 - t * 300;
			return window.innerWidth < 1024
				? `transform: ${existingTransform} translateY(${x}px); opacity: ${t}`
				: `transform: ${existingTransform} translateX(${x}px); opacity: ${t}`;
		}
	};
}
