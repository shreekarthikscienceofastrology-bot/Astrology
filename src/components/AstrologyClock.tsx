'use client'

import { useEffect, useState } from 'react'

const INDIA_TIME_ZONE = 'Asia/Kolkata'

type ClockState = {
  hours: number
  minutes: number
  seconds: number
  date: Date
}

const zodiacSigns = [
  ['Aries', '♈'],
  ['Taurus', '♉'],
  ['Gemini', '♊'],
  ['Cancer', '♋'],
  ['Leo', '♌'],
  ['Virgo', '♍'],
  ['Libra', '♎'],
  ['Scorpio', '♏'],
  ['Sagittarius', '♐'],
  ['Capricorn', '♑'],
  ['Aquarius', '♒'],
  ['Pisces', '♓'],
]

const planets = [
  { name: 'Sun', symbol: '☉', color: '#f6b928', orbit: 31, offset: 0 },
  { name: 'Moon', symbol: '☽', color: '#d8e3ed', orbit: 38, offset: 92 },
  { name: 'Mercury', symbol: '☿', color: '#c98957', orbit: 44, offset: 160 },
  { name: 'Venus', symbol: '♀', color: '#e9a7a0', orbit: 48, offset: 230 },
  { name: 'Mars', symbol: '♂', color: '#dd604a', orbit: 48, offset: 310 },
]

function getClockState(): ClockState {
  const date = new Date()
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: INDIA_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const getPart = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0)

  return {
    hours: getPart('hour'),
    minutes: getPart('minute'),
    seconds: getPart('second'),
    date,
  }
}

function polarPoint(angle: number, radius: number) {
  const radians = (angle - 90) * (Math.PI / 180)
  return {
    x: Number((50 + Math.cos(radians) * radius).toFixed(3)),
    y: Number((50 + Math.sin(radians) * radius).toFixed(3)),
  }
}

export default function AstrologyClock() {
  const [clock, setClock] = useState<ClockState | null>(null)

  useEffect(() => {
    const updateClock = () => setClock(getClockState())
    updateClock()
    const interval = window.setInterval(updateClock, 1000)
    return () => window.clearInterval(interval)
  }, [])

  const hourAngle = clock ? ((clock.hours % 12) + clock.minutes / 60) * 30 : 0
  const minuteAngle = clock ? (clock.minutes + clock.seconds / 60) * 6 : 0
  const secondAngle = clock ? clock.seconds * 6 : 0
  const timeLabel = clock
    ? clock.date.toLocaleTimeString('en-IN', {
        timeZone: INDIA_TIME_ZONE,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    : 'Indian Standard Time'
  const dateLabel = clock
    ? clock.date.toLocaleDateString('en-IN', { timeZone: INDIA_TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'Indian Standard Time (IST)'

  return (
    <section className="astrology-clock-section" aria-labelledby="astrology-clock-title">
      <div className="max-w-7xl mx-auto px-4">
        <div className="astrology-clock-panel">
          <div className="astrology-clock-copy">
            <p className="astrology-clock-eyebrow">Live Indian Standard Time</p>
            <h2 id="astrology-clock-title">The Astrology Clock</h2>
            <p className="astrology-clock-date" suppressHydrationWarning>{dateLabel}</p>
          </div>

          <div className="astrology-clock-face-wrap">
            <svg className="astrology-clock-face" viewBox="0 0 100 100" role="img" aria-label={`Astrology clock showing ${timeLabel} Indian Standard Time`}>
              <circle cx="50" cy="50" r="47" className="clock-outer-ring" />
              <circle cx="50" cy="50" r="42" className="clock-zodiac-ring" />
              <circle cx="50" cy="50" r="28" className="clock-inner-ring" />
              {zodiacSigns.map(([name, symbol], index) => {
                const point = polarPoint(index * 30 + 15, 37)
                return (
                  <g key={name}>
                    <line x1="50" y1="8" x2="50" y2="12" className="clock-tick" transform={`rotate(${index * 30} 50 50)`} />
                    <text x={point.x} y={point.y} className="clock-zodiac-symbol" textAnchor="middle" dominantBaseline="middle">{symbol}</text>
                    <title>{name}</title>
                  </g>
                )
              })}
              {Array.from({ length: 12 }).map((_, index) => (
                <line key={index} x1="50" y1="15" x2="50" y2="18" className="clock-hour-tick" transform={`rotate(${index * 30} 50 50)`} />
              ))}
              {planets.map((planet) => {
                const point = polarPoint((clock?.seconds ?? 0) * 0.15 + planet.offset, planet.orbit)
                return (
                  <g key={planet.name}>
                    <circle cx={point.x} cy={point.y} r="2.5" fill={planet.color} className="clock-planet" />
                    <text x={point.x} y={point.y + 0.7} className="clock-planet-symbol" textAnchor="middle" dominantBaseline="middle">{planet.symbol}</text>
                    <title>{planet.name}</title>
                  </g>
                )
              })}
              <line x1="50" y1="50" x2="50" y2="34" className="clock-hour-hand" transform={`rotate(${hourAngle} 50 50)`} />
              <line x1="50" y1="50" x2="50" y2="23" className="clock-minute-hand" transform={`rotate(${minuteAngle} 50 50)`} />
              <line x1="50" y1="53" x2="50" y2="18" className="clock-second-hand" transform={`rotate(${secondAngle} 50 50)`} />
              <circle cx="50" cy="50" r="2.1" className="clock-center" />
            </svg>
            <div className="astrology-clock-time" aria-live="polite" suppressHydrationWarning>{timeLabel} IST</div>
          </div>
        </div>
      </div>
    </section>
  )
}
