import type * as Kit from '@sveltejs/kit';
 
type RouteParams = {}
 
export type PageServerLoad = Kit.ServerLoad<RouteParams>;
export type PageLoad = Kit.Load<RouteParams>;
export type Actions = Kit.Actions<RouteParams>;
export type PageData = Kit.PageData<RouteParams>;
export type ActionData = Kit.ActionData<RouteParams>;