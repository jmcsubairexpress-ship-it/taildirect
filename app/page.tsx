export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-tight">TailDirect</h1>
        <div className="flex gap-4">
          <a href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">Log In</a>
          <a href="/signup" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition">Get Started</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-32">
        <h2 className="text-5xl font-bold max-w-3xl leading-tight">
          Book Private Jets Direct.<br />No Brokers. No Markups.
        </h2>
        <p className="mt-6 text-xl text-gray-400 max-w-2xl">
          TailDirect connects you directly with FAA-certified operators. Save thousands on every flight.
        </p>
        <div className="mt-10 flex gap-4">
          <a href="/signup" className="px-8 py-4 bg-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-500 transition">
            Start Flying Direct
          </a>
          <a href="/operators" className="px-8 py-4 border border-gray-700 rounded-xl text-lg font-semibold hover:border-gray-500 transition">
            List Your Aircraft
          </a>
        </div>
      </section>

      {/* Value Props */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-20 max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-3">No Broker Markups</h3>
          <p className="text-gray-400">Pay the operator directly. Keep the thousands brokers take off the top.</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-3">ADS-B Powered Matching</h3>
          <p className="text-gray-400">We surface operators with aircraft already near you — cutting positioning costs dramatically.</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-3">FAA Verified Operators</h3>
          <p className="text-gray-400">Every operator is verified against the FAA registry and carries confirmed insurance coverage.</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-8 py-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-xl font-bold mb-2">Flyer Membership</h3>
            <p className="text-4xl font-bold my-4">$650<span className="text-lg text-gray-400">/year</span></p>
            <p className="text-gray-400">Unlimited access to the entire TailDirect operator network. Request quotes, compare aircraft, fly direct.</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 border border-blue-700">
            <h3 className="text-xl font-bold mb-2">Operator Listing</h3>
            <p className="text-4xl font-bold my-4">$150<span className="text-lg text-gray-400">/tail/mo</span></p>
            <p className="text-gray-400">List each aircraft on TailDirect. Receive direct quote requests. Keep your full margins.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-8 py-8 text-center text-gray-500">
        <p>© 2026 TailDirect. All rights reserved.</p>
      </footer>
    </main>
  )
}