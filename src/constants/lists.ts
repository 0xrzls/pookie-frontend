// used to mark unsupported tokens, these are hosted lists of unsupported tokens
const KAKAROT_LIST = 'https://api.npoint.io/37150f7e1ef246b5c0d1'

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [KAKAROT_LIST]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [KAKAROT_LIST]
