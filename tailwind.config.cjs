/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/tw-elements/dist/js/**/*.js'],
	theme: {
		extend: {
			fontFamily: {
				mplus1: ['"M PLUS 1p"', 'sans-serif'],
				opensans: ['"Open Sans"', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif']
			}
		}
	},
	plugins: [require('tw-elements/dist/plugin'), require('@tailwindcss/line-clamp')]
};
