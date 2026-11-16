export async function measureImage(file: File) {
  const url = URL.createObjectURL(file)

  try {
    const img = new Image()
    img.src = url

    await img.decode()

    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
    }
  } catch {
    return {}
  } finally {
    URL.revokeObjectURL(url)
  }
}

// async function measure(file: File) {
//   try {
//     const bmp = await createImageBitmap(file)
//     const size = { width: bmp.width, height: bmp.height }
//     bmp.close()
//     return size
//   } catch {
//     return {}
//   }
// }
