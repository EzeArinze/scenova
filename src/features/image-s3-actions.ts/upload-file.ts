import { upload } from '@tigrisdata/storage/client'

const MULTIPART_THRESHOLD = 5 * 1024 * 1024

// const safeName = (name: string) => name.replace(/[^\w.-]+/g, '_').slice(-80)

// export async function uploadFile(
//   file: File,
//   userId: string,
//   onProgress: (pct: number) => void,
// ) {
//   const key = `${userId}/${nanoid()}-${safeName(file.name)}`

//   const result = await upload(key, file, {
//     url: '/api/upload',
//     access: 'private',
//     multipart: file.size > MULTIPART_THRESHOLD,
//     onUploadProgress: ({ percentage }) => onProgress(percentage),
//   })
//   if (result.error) throw result.error

//   return key
// }

export async function uploadFile(
  file: File,
  key: string,
  onProgress: (pct: number) => void,
) {
  const result = await upload(key, file, {
    url: '/api/upload',
    access: 'private',
    multipart: file.size > MULTIPART_THRESHOLD,
    onUploadProgress: ({ percentage }) => onProgress(percentage),
  })
  if (result.error) throw result.error
}
