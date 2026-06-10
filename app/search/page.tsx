'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { value: '', label: 'Any Aircraft Type' },
  { value: 'turboprop', label: 'Turboprop' },
  { value: 'light_jet', label: 'Light Jet' },
  { value: 'midsize_jet', label: 'Midsize Jet' },
  { value: 'super_midsize_jet', label: 'Super Midsize Jet' },
  { value: 'heavy_jet', label: 'Heavy Jet' },
  { value: 'ultra_long_range', label: 'Ultra Long Range' },
]

export default function SearchPage() {
  const [departure, setDeparture] = useState('')
  const [arrival, setArrival] = useState('')
  const [flightDate, setFlightDate] = useState('')
  const [passengers, setPassengers] = useState('1')
  const [category, setCategory] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    getProfile()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    let query = supabase
      .from('aircraft')
      .select(`
        *,
        operators (
          id,
          company_name,
          faa_verified,
          insurance_verified,
          profiles (full_name)
        )
      `)
      .gte('passenger_capacity', parseInt(passengers))

    if (category) query = query.eq('category', category)

    const { data, error } = await query

    if (error) {
      console.error(error)
      setResults([])
    } else {
      setResults(data || [])
    }

    setLoading(false)
  }

  const handleRequestQuote = async (aircraftId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }

    const { error } = await supabase.from('quote_requests').insert({
      consumer_id: user.id,
      aircraft_id: aircraftId,
      departure_icao: departure.toUpperCase(),
      arrival_icao: arrival.toUpperCase(),
      flight_date: flightDate,
      passenger_count: parseInt(passengers),
    })

    if (error) {
      alert('Error sending request: ' + error.message)
    } else {
      alert('Quote request sent! The operator will contact you directly.')
    }
  }

  const categoryLabel = (val: string) => CATEGORIES.find(c => c.value === val)?.label || val

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <a href="/" className="text-2xl font-bold tracking-tight">TailDirect</a>
        <div className="flex gap-4">
          <a href="/dashboard" className="px-4 py-2 text-gray-400 hover:text-white transition">Dashboard</a>
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-10">Find Your Flight</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-gray-900 rounded-2xl p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Departure Airport (ICAO e.g. KTEB)"
              value={departure}
              onChange={e => setDeparture(e.target.value)}
              required
              className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              placeholder="Arrival Airport (ICAO e.g. KLAX)"
              value={arrival}
              onChange={e => setArrival(e.target.value)}
              required
              className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="date"
              value={flightDate}
              onChange={e => setFlightDate(e.target.value)}
              required
              className="bg-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="number"
              placeholder="Number of Passengers"
              value={passengers}
              onChange={e => setPassengers(e.target.value)}
              min="1"
              required
              className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-600"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-500 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Available Aircraft'}
          </button>
        </form>

        {/* Results */}
        {searched && !loading && results.length === 0 && (
          <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
            <p className="text-gray-400 text-lg">No aircraft found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your passenger count or aircraft type.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-gray-400">{results.length} aircraft available</p>
            {results.map(plane => (
              <div key={plane.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold">{plane.tail_number}</h3>
                    {plane.operators?.faa_verified && (
                      <span className="px-2 py-0.5 bg-green-900 text-green-400 rounded-full text-xs font-semibold">FAA Verified</span>
                    )}
                    {plane.operators?.insurance_verified && (
                      <span className="px-2 py-0.5 bg-blue-900 text-blue-400 rounded-full text-xs font-semibold">Insured</span>
                    )}
                  </div>
                  <p className="text-gray-400">{plane.make_model} · {categoryLabel(plane.category)} · {plane.passenger_capacity} pax max</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {plane.operators?.company_name} · Home Base: {plane.home_base_icao}
                  </p>
                </div>
                <button
                  onClick={() => handleRequestQuote(plane.id)}
                  className="px-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition whitespace-nowrap"
                >
                  Request Quote
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}