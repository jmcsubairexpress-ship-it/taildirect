'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    getProfile()
  }, [])

  if (loading) return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <a href="/" className="text-2xl font-bold tracking-tight">TailDirect</a>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/'
          }}
          className="px-4 py-2 text-gray-400 hover:text-white transition"
        >
          Sign Out
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-2">
          Welcome, {profile?.full_name}
        </h2>
        <p className="text-gray-400 mb-12">
          {profile?.role === 'consumer' ? 'Flyer Account' : 'Operator Account'}
        </p>

        {profile?.role === 'consumer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="/search" className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-blue-600 transition">
              <h3 className="text-xl font-bold mb-2">Search Flights</h3>
              <p className="text-gray-400">Find operators near your route and request quotes.</p>
            </a>
            <a href="/empty-legs" className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-blue-600 transition">
              <h3 className="text-xl font-bold mb-2">Empty Legs</h3>
              <p className="text-gray-400">Browse discounted empty leg flights available now.</p>
            </a>
          </div>
        )}

        {profile?.role === 'operator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="/operator/fleet" className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-blue-600 transition">
              <h3 className="text-xl font-bold mb-2">Manage Fleet</h3>
              <p className="text-gray-400">Add and manage your aircraft listings.</p>
            </a>
            <a href="/operator/requests" className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-blue-600 transition">
              <h3 className="text-xl font-bold mb-2">Quote Requests</h3>
              <p className="text-gray-400">View and respond to incoming quote requests.</p>
            </a>
          </div>
        )}
      </div>
    </main>
  )
}