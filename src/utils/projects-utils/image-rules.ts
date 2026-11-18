export const MAX_IMAGE_BYTES = 20 * 1024 * 1024

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const

export type AllowedImageType = keyof typeof EXTENSIONS

export const ALLOWED_IMAGE_TYPES = Object.keys(EXTENSIONS) as AllowedImageType[]

export function isAllowedImageType(
  type: string | undefined,
): type is AllowedImageType {
  // hasOwn, not `in`: `in` also matches inherited keys like "toString".
  return type !== undefined && Object.hasOwn(EXTENSIONS, type)
}

export function extensionFor(type: AllowedImageType) {
  return EXTENSIONS[type]
}

// Everything after `${userId}/`: a nanoid (default alphabet, 21 chars) plus an
// extension we chose. No user-supplied file name ends up in the key.
const KEY_TAIL = /^[A-Za-z0-9_-]{21}\.(jpg|png|webp)$/

export function makeUploadKey(
  userId: string,
  id: string,
  type: AllowedImageType,
) {
  return `${userId}/${id}.${extensionFor(type)}`
}

export function isValidUploadKey(key: string, userId: string) {
  const prefix = `${userId}/`
  return key.startsWith(prefix) && KEY_TAIL.test(key.slice(prefix.length))
}
