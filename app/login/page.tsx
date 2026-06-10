'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <a href="/" className="text-2xl font-bold tracking-tight block text-center mb-8">TailDirect</a>

        <form onSubmit={handleLogin} className="bg-gray-900 rounded-2xl p-8 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2">Welcome Back</h2>

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

          {message && (
            <p className="text-sm text-red-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-blue-600 hover:bg-blue-500 transition rounded-lg py-3 font-semibold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account? <a href="/signup" className="text-blue-400 hover:text-blue-300">Sign up</a>
          </p>
        </form>
      </div>
    </main>
  )
}