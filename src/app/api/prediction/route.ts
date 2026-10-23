import { NextResponse } from 'next/server'
import { readMonthlyPrediction } from '@/lib/monthlyPrediction'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(await readMonthlyPrediction())
  } catch (error) {
    console.error('Unable to load monthly prediction:', error)
    return NextResponse.json({ error: 'Monthly prediction is unavailable.' }, { status: 500 })
  }
}