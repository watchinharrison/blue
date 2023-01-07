import { writable } from 'svelte/store';

export const activePost = writable(null);
export const activeImage = writable(null);
export const replyPost = writable(null);
export const activeUser = writable(null);
