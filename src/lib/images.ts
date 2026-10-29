import { z } from 'zod'

// ─── Item image helpers ───────────────────────────────────────────────────────

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024
const MAX_IMAGE_DIMENSION = 1600
const WEBP_QUALITY = 0.82

export const IMAGE_INPUT_ACCEPT = ACCEPTED_IMAGE_TYPES.join(',')

// Validates the file the user picked; it is compressed before upload (backend limit is 5 MB)
export const itemImageSchema = z
  .instanceof(File)
  .refine((file) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type), {
    message: 'Yalnızca JPEG, PNG veya WebP görseller yüklenebilir',
  })
  .refine((file) => file.size <= MAX_SOURCE_IMAGE_BYTES, {
    message: 'Görsel en fazla 20 MB olabilir',
  })

/** Resizes the image to fit within 1600px and re-encodes it as WebP. */
export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D context is not available')
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Image encoding failed'))),
      'image/webp',
      WEBP_QUALITY
    )
  })
}
