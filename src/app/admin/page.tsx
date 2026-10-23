'use client'

import { FormEvent, useState } from 'react'
import type { MonthlyPrediction } from '@/lib/monthlyPrediction'
import AdminNavigation from '@/components/AdminNavigation'

const emptyPrediction: MonthlyPrediction = {
  month: '',
  title: '',
  introduction: '',
  predictions: ['', '', '', ''],
  luckySigns: '',
  luckyNumbers: '',
  updatedAt: '',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [prediction, setPrediction] = useState(emptyPrediction)
  const [authenticated, setAuthenticated] = useState(false)
  const [status, setStatus] = useState('')

  async function login(event: FormEvent) {
    event.preventDefault()
    setStatus('')
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!response.ok) {
      setStatus('Incorrect password.')
      return
    }
    setAuthenticated(true)
    setPassword('')
    const predictionResponse = await fetch('/api/admin/prediction')
    setPrediction(await predictionResponse.json())
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setStatus('Saving...')
    const response = await fetch('/api/admin/prediction', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prediction),
    })
    setStatus(response.ok ? 'Prediction saved.' : 'Unable to save prediction.')
  }

  function update(field: keyof MonthlyPrediction, value: string) {
    setPrediction((current) => ({ ...current, [field]: value }))
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#fff8e5] px-4 pt-40 pb-20">
        <form onSubmit={login} className="card-glass max-w-md mx-auto rounded-lg p-8">
          <h1 className="text-3xl font-bold gradient-text mb-3">Prediction Admin</h1>
          <p className="text-slate-600 mb-6">Sign in to update the monthly prediction.</p>
          <label className="block text-slate-700 font-semibold mb-2" htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-gold/40 rounded-lg px-4 py-3 mb-4" required />
          <button type="submit" className="btn-gold w-full">Sign in</button>
          {status && <p className="text-red-700 mt-4" role="alert">{status}</p>}
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fff8e5] px-4 pt-40 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <AdminNavigation />

        <form onSubmit={save} className="card-glass mx-auto rounded-lg p-8">
          <h1 className="text-3xl font-bold gradient-text mb-8">Edit Monthly Prediction</h1>
          <div className="grid md:grid-cols-2 gap-6">
            {(['month', 'title', 'luckySigns', 'luckyNumbers'] as const).map((field) => (
              <label key={field} className="text-slate-700 font-semibold capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
                <input value={prediction[field]} onChange={(event) => update(field, event.target.value)} className="mt-2 w-full border border-gold/40 rounded-lg px-4 py-3 font-normal" required />
              </label>
            ))}
          </div>
          <label className="block text-slate-700 font-semibold mt-6">Introduction<textarea value={prediction.introduction} onChange={(event) => update('introduction', event.target.value)} className="mt-2 w-full border border-gold/40 rounded-lg px-4 py-3 font-normal" rows={4} required /></label>
          <div className="mt-6 space-y-4">
            {prediction.predictions.map((item, index) => (
              <label key={index} className="block text-slate-700 font-semibold">Prediction {index + 1}<textarea value={item} onChange={(event) => setPrediction((current) => ({ ...current, predictions: current.predictions.map((entry, itemIndex) => itemIndex === index ? event.target.value : entry) }))} className="mt-2 w-full border border-gold/40 rounded-lg px-4 py-3 font-normal" rows={3} required /></label>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4"><button type="submit" className="btn-gold">Save prediction</button>{status && <p className="text-slate-700" role="status">{status}</p>}</div>
        </form>
      </div>
    </main>
  )
}