'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-900 text-yellow-400',
  quoted: 'bg-blue-900 text-blue-400',
  accepted: 'bg-green-900 text-green-400',
  declined: 'bg-red-900 text-red-400',
  expired: 'bg-gray-800 text-gray-500',
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'operator') {
        window.location.href = '/dashboard'
        return
      }

      const { data: operator } = await supabase
        .from('operators')
        .select('id')
        .eq('profile_id', user.id)
        .single()

      if (!operator) { setLoading(false); return }

      const { data: aircraft } = await supabase
        .from('aircraft')
        .select('id')
        .eq('operator_id', operator.id)

      const aircraftIds = (aircraft || []).map((a: any) => a.id)

      if (aircraftIds.length === 0) { setLoading(false); return }

      const { data: reqs } = await supabase
        .from('quote_requests')
        .select(`
          *,
          aircraft (tail_number, make_model),
          profiles (full_name, email)
        `)
        .in('aircraft_id', aircraftIds)
        .order('created_at', { ascending: false })

      setRequests(reqs || [])
      setLoading(false)
    }
    load()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from('quote_requests')
      .update({ status })
      .eq('id', id)

    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status } : r)
    )
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

      <div className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-10">Quote Requests</h2>

        {requests.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
            <p className="text-gray-400 text-lg">No quote requests yet.</p>
            <p className="text-gray-500 mt-2">Requests from consumers will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map(req => (
              <div key={req.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {req.departure_icao} → {req.arrival_icao}
                    </h3>
                    <p className="text-gray-400 mt-1">
                      {req.aircraft?.tail_number} · {req.aircraft?.make_model}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(req.flight_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      {' · '}{req.passenger_count} passenger{req.passenger_count > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[req.status]}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>

                <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Consumer</p>
                    <p className="font-semibold">{req.profiles?.full_name}</p>
                    <p className="text-gray-500 text-sm">{req.profiles?.email}</p>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(req.id, 'quoted')}
                        className="px-4 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition text-sm"
                      >
                        Mark as Quoted
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, 'declined')}
                        className="px-4 py-2 border border-red-800 text-red-400 rounded-lg font-semibold hover:border-red-600 transition text-sm"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}