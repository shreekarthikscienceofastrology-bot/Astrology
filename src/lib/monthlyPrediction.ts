import { promises as fs } from 'fs'
import path from 'path'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export interface MonthlyPrediction {
  month: string
  title: string
  introduction: string
  predictions: string[]
  luckySigns: string
  luckyNumbers: string
  updatedAt: string
}

const predictionPath = path.join(process.cwd(), 'data', 'monthly-prediction.json')

export async function readMonthlyPrediction(): Promise<MonthlyPrediction> {
  const supabase = getSupabaseServerClient()

  if (supabase) {
    const { data, error } = await supabase
      .from('monthly_predictions')
      .select('payload')
      .eq('id', 'current')
      .maybeSingle()

    if (error) throw new Error(`Unable to read monthly prediction from Supabase: ${error.message}`)
    if (data) return data.payload as MonthlyPrediction

    const legacyPrediction = await readMonthlyPredictionFromJson()
    await writeMonthlyPredictionToSupabase(supabase, legacyPrediction)
    return legacyPrediction
  }

  return readMonthlyPredictionFromJson()
}

async function readMonthlyPredictionFromJson(): Promise<MonthlyPrediction> {
  const content = await fs.readFile(predictionPath, 'utf8')
  return JSON.parse(content) as MonthlyPrediction
}

export async function writeMonthlyPrediction(prediction: MonthlyPrediction) {
  const supabase = getSupabaseServerClient()

  if (supabase) {
    await writeMonthlyPredictionToSupabase(supabase, prediction)
    return
  }

  await fs.writeFile(predictionPath, `${JSON.stringify(prediction, null, 2)}\n`, 'utf8')
}

async function writeMonthlyPredictionToSupabase(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  prediction: MonthlyPrediction,
) {
  const { error } = await supabase.from('monthly_predictions').upsert({
    id: 'current',
    payload: prediction,
    updated_at: prediction.updatedAt,
  })

  if (error) throw new Error(`Unable to save monthly prediction to Supabase: ${error.message}`)
}