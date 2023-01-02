// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		email: string;
		password: string;
	}
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	interface Platform {
		env: {
			DB: D1Database,
			FILE_BUCKET: R2Bucket
		}
	}

}
