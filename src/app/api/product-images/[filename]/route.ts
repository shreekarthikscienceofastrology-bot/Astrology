import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const imageDirectory = path.join(process.cwd(), 'public', 'images', 'products')
const contentTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

export async function GET(_request: Request, { params }: { params: { filename: string } }) {
  const { filename } = params
  const match = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.(jpg|png|webp)$/i.exec(filename)

  if (!match) {
    return NextResponse.json({ error: 'Image not found.' }, { status: 404 })
  }

  try {
    const image = await fs.readFile(path.join(imageDirectory, filename))
    return new NextResponse(new Uint8Array(image), {
      headers: {
        'Content-Type': contentTypes[match[2].toLowerCase()],
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return NextResponse.json({ error: 'Image not found.' }, { status: 404 })
    }

    throw error
  }
}
