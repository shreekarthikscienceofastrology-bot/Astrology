import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

import { isAdminAuthenticated } from '@/lib/adminAuth'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const maxLocalImageSize = 4 * 1024 * 1024
const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const supabase = getSupabaseServerClient()

  if (request.headers.get('content-type')?.includes('application/json')) {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase server credentials are not configured.' }, { status: 503 })
    }

    const payload = await request.json()
    const contentType = typeof payload.contentType === 'string' ? payload.contentType : ''
    const extension = allowedTypes.get(contentType)

    if (!extension) {
      return NextResponse.json({ error: 'Only JPEG, PNG, and WebP images are supported.' }, { status: 400 })
    }

    const filename = `${randomUUID()}.${extension}`
    const { data, error } = await supabase.storage.from('product-images').createSignedUploadUrl(filename)

    if (error) {
      return NextResponse.json({ error: `Unable to prepare image upload: ${error.message}` }, { status: 502 })
    }

    const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(data.path)
    return NextResponse.json({ path: data.path, token: data.token, url: publicUrl.publicUrl })
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

  if (image.size <= 0 || image.size > maxLocalImageSize) {
    return NextResponse.json({ error: 'Local image uploads must be smaller than 4 MB.' }, { status: 400 })
  }

  const filename = `${randomUUID()}.${extension}`
  const bytes = Buffer.from(await image.arrayBuffer())
  const uploadDirectory = path.join(process.cwd(), 'public', 'images', 'products')
  await fs.mkdir(uploadDirectory, { recursive: true })
  await fs.writeFile(path.join(uploadDirectory, filename), bytes)

  return NextResponse.json({ url: `/images/products/${filename}` })
}