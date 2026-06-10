'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const [role, setRole] = useState<'consumer' | 'operator'>('consumer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        }
      }
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      setMessage('Account created! Redirecting...')
      window.location.href = '/dashboard'
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <a href="/" className="text-2xl font-bold tracking-tight block text-center mb-8">TailDirect</a>

        {/* Role Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-800 mb-8">
          <button
            onClick={() => setRole('consumer')}
            className={`flex-1 py-3 text-sm font-semibold transition ${role === 'consumer' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
          >
            I want to fly
          </button>
          <button
            onClick={() => setRole('operator')}
            className={`flex-1 py-3 text-sm font-semibold transition ${role === 'operator' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
          >
            I operate aircraft
          </button>
        </div>

        <form onSubmit={handleSignup} className="bg-gray-900 rounded-2xl p-8 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2">
            {role === 'consumer' ? 'Create Flyer Account' : 'Create Operator Account'}
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
          />

          {role === 'consumer' && (
            <p className="text-sm text-gray-400">
              Flyer membership: <span className="text-white font-semibold">$650/year</span> — unlimited operator access, no booking fees.
            </p>
          )}

          {role === 'operator' && (
            <p className="text-sm text-gray-400">
              Operator access: <span className="text-white font-semibold">$150/tail/month</span> — list your fleet, receive direct quote requests.
            </p>
          )}

          {message && (
            <p className="text-sm text-blue-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-blue-600 hover:bg-blue-500 transition rounded-lg py-3 font-semibold disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account? <a href="/login" className="text-blue-400 hover:text-blue-300">Log in</a>
          </p>
        </form>
      </div>
    </main>
  )
}