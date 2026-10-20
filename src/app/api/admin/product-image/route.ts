import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

import { isAdminAuthenticated } from '@/lib/adminAuth'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const maxImageSize = 5 * 1024 * 1024
const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const formData = await request.formData()
  const image = formData.get('image')

  if (!(image instanceof File)) {
    return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 })
  }

  const extension = allowedTypes.get(image.type)
  if (!extension) {
    return NextResponse.json({ error: 'Only JPEG, PNG, and WebP images are supported.' }, { status: 400 })
  }

  if (image.size <= 0 || image.size > maxImageSize) {
    return NextResponse.json({ error: 'The image must be smaller than 5 MB.' }, { status: 400 })
  }

  const filename = `${randomUUID()}.${extension}`
  const bytes = Buffer.from(await image.arrayBuffer())
  const supabase = getSupabaseServerClient()

  if (supabase) {
    const { error } = await supabase.storage
      .from('product-images')
      .upload(filename, bytes, { contentType: image.type, upsert: false })

    if (error) {
      return NextResponse.json({ error: `Image upload failed: ${error.message}` }, { status: 502 })
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
    return NextResponse.json({ url: data.publicUrl })
  }

  const uploadDirectory = path.join(process.cwd(), 'public', 'images', 'products')
  await fs.mkdir(uploadDirectory, { recursive: true })
  await fs.writeFile(path.join(uploadDirectory, filename), bytes)

  return NextResponse.json({ url: `/images/products/${filename}` })
}