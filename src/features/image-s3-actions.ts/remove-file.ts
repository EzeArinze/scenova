import { deleteUpload } from '../server/file/file-remove'

export function discard(key: string) {
  deleteUpload({ data: { key } }).catch((err) => console.error(err))
}
