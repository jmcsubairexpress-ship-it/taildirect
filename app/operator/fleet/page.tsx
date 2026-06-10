'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { value: 'turboprop', label: 'Turboprop' },
  { value: 'light_jet', label: 'Light Jet' },
  { value: 'midsize_jet', label: 'Midsize Jet' },
  { value: 'super_midsize_jet', label: 'Super Midsize Jet' },
  { value: 'heavy_jet', label: 'Heavy Jet' },
  { value: 'ultra_long_range', label: 'Ultra Long Range' },
]

export default function FleetPage() {
  const [aircraft, setAircraft] = useState<any[]>([])
  const [operator, setOperator] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [tailNumber, setTailNumber] = useState('')
  const [makeModel, setMakeModel] = useState('')
  const [category, setCategory] = useState('light_jet')
  const [passengerCapacity, setPassengerCapacity] = useState('')
  const [homeBase, setHomeBase] = useState('')
  const [yearManufactured, setYearManufactured] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, operators(*)')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'operator') {
        window.location.href = '/dashboard'
        return
      }

      if (profile?.operators?.length > 0) {
        const op = profile.operators[0]
        setOperator(op)

        const { data: planes } = await supabase
          .from('aircraft')
          .select('*')
          .eq('operator_id', op.id)

        setAircraft(planes || [])
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleAddAircraft = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    let operatorId = operator?.id

    if (!operatorId) {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: newOp, error: opError } = await supabase
        .from('operators')
        .insert({ profile_id: user!.id, company_name: 'My Company' })
        .select()
        .single()

      if (opError) { setMessage(opError.message); setSaving(false); return }
      setOperator(newOp)
      operatorId = newOp.id
    }

    const { error } = await supabase.from('aircraft').insert({
      operator_id: operatorId,
      tail_number: tailNumber.toUpperCase(),
      make_model: makeModel,
      category,
      passenger_capacity: parseInt(passengerCapacity),
      home_base_icao: homeBase.toUpperCase(),
      year_manufactured: yearManufactured ? parseInt(yearManufactured) : null,
    })

    if (error) {
      setMessage(error.message)
    } else {
      const { data: planes } = await supabase
        .from('aircraft')
        .select('*')
        .eq('operator_id', operatorId)

      setAircraft(planes || [])
      setShowForm(false)
      setTailNumber('')
      setMakeModel('')
      setPassengerCapacity('')
      setHomeBase('')
      setYearManufactured('')
    }

    setSaving(false)
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </main>
  )

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

      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">Your Fleet</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition"
          >
            + Add Aircraft
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddAircraft} className="bg-gray-900 rounded-2xl p-8 mb-10 flex flex-col gap-4">
            <h3 className="text-xl font-bold mb-2">Add New Aircraft</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tail Number (e.g. N12345)"
                value={tailNumber}
                onChange={e => setTailNumber(e.target.value)}
                required
                className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                placeholder="Make & Model (e.g. Citation XLS)"
                value={makeModel}
                onChange={e => setMakeModel(e.target.value)}
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
              <input
                type="number"
                placeholder="Passenger Capacity"
                value={passengerCapacity}
                onChange={e => setPassengerCapacity(e.target.value)}
                required
                className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                placeholder="Home Base (ICAO code e.g. KTEB)"
                value={homeBase}
                onChange={e => setHomeBase(e.target.value)}
                required
                className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="number"
                placeholder="Year Manufactured (optional)"
                value={yearManufactured}
                onChange={e => setYearManufactured(e.target.value)}
                className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {message && <p className="text-red-400 text-sm">{message}</p>}

            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Aircraft'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-700 rounded-xl font-semibold hover:border-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {aircraft.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
            <p className="text-gray-400 text-lg">No aircraft listed yet.</p>
            <p className="text-gray-500 mt-2">Click "Add Aircraft" to list your first tail number.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {aircraft.map(plane => (
              <div key={plane.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{plane.tail_number}</h3>
                  <p className="text-gray-400">{plane.make_model} · {CATEGORIES.find(c => c.value === plane.category)?.label} · {plane.passenger_capacity} pax</p>
                  <p className="text-gray-500 text-sm mt-1">Home Base: {plane.home_base_icao}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${plane.subscription_status === 'active' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
                  {plane.subscription_status === 'active' ? 'Active' : 'Pending Payment'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}