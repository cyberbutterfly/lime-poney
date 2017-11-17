export type WithDisplayName<T extends Function> = T & {
	displayName?: string;
}
