import { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { APP_NAME } from '../config/app';

const HOST_STEPS = [
  { n: '01', title: 'Add your property', desc: 'List your condo, house, or Airbnb in under a minute.' },
  { n: '02', title: 'Find a cleaner', desc: 'Browse verified cleaners by area, price, and service type. See real ratings.' },
  { n: '03', title: 'Book & relax', desc: 'Send a booking request, confirm the schedule, and get it done.' },
];

const CLEANER_STEPS = [
  { n: '01', title: 'Build your profile', desc: 'Set your rate, service area, and the types of cleaning you offer.' },
  { n: '02', title: 'Get discovered', desc: 'Hosts in your area will find you through search and book directly.' },
  { n: '03', title: 'Grow your business', desc: 'Collect reviews, build a reputation, and earn more over time.' },
];

const TRUST_ITEMS = [
  { icon: '⭐', title: 'Verified reviews', desc: 'Every review comes from a real, completed booking — no fake ratings.' },
  { icon: '📍', title: 'UK focused', desc: 'Built specifically for the UK market — London, Manchester, Edinburgh, and beyond.' },
  { icon: '🔒', title: 'Secure & private', desc: 'Your data is protected. Contact details are never shared publicly.' },
  { icon: '💸', title: 'Transparent pricing', desc: "Cleaners set their own rates. You see the total before you book — no surprises." },
];

export function LandingPage() {
  const navigate = useNavigate();
  const areaRef = useRef(null);

  function handleHeroSearch(e) {
    e.preventDefault();
    const area = areaRef.current?.value?.trim();
    navigate(`/search${area ? `?area=${encodeURIComponent(area)}` : ''}`);
  }

  return (
    <div className="bg-[#F7F3EE]">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <span className="inline-block mb-4 px-3 py-1 text-xs font-medium bg-teal-50 text-[#0D9488] rounded-full">
          Now serving the United Kingdom
        </span>
        <h1 className="font-heading text-5xl sm:text-6xl font-semibold text-gray-900 leading-tight">
          Your property,<br />always guest-ready.
        </h1>
        <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">
          {APP_NAME} connects UK property hosts with trusted, reviewed cleaners — so you never have to worry about turnovers again.
        </p>

        {/* Search bar */}
        <form onSubmit={handleHeroSearch} className="mt-8 flex max-w-md mx-auto gap-2">
          <input
            ref={areaRef}
            type="text"
            placeholder="Search by area — e.g. London, Manchester, Edinburgh..."
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          />
          <Button type="submit" className="px-5 py-3 shrink-0">Search</Button>
        </form>

        <p className="mt-4 text-sm text-gray-400">
          Are you a cleaner?{' '}
          <Link to="/register" className="text-[#0D9488] hover:underline">
            List your services →
          </Link>
        </p>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-center text-gray-900 mb-4">How it works</h2>
          <p className="text-center text-gray-500 mb-12 max-w-lg mx-auto">Simple for hosts. Simple for cleaners.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For hosts */}
            <div>
              <p className="text-xs font-semibold text-[#0D9488] uppercase tracking-widest mb-6">For hosts</p>
              <div className="space-y-6">
                {HOST_STEPS.map(({ n, title, desc }) => (
                  <div key={n} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-teal-50 text-[#0D9488] font-heading font-semibold text-sm flex items-center justify-center">
                      {n}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{title}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button onClick={() => navigate('/register')} className="px-6">
                  Find a cleaner
                </Button>
              </div>
            </div>

            {/* For cleaners */}
            <div>
              <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-widest mb-6">For cleaners</p>
              <div className="space-y-6">
                {CLEANER_STEPS.map(({ n, title, desc }) => (
                  <div key={n} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-amber-50 text-[#F59E0B] font-heading font-semibold text-sm flex items-center justify-center">
                      {n}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{title}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="secondary" onClick={() => navigate('/register')} className="px-6">
                  Join as a cleaner
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-center text-gray-900 mb-12">Why {APP_NAME}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="text-2xl mb-3">{icon}</div>
                <p className="font-semibold text-gray-900 mb-1">{title}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#0D9488] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl text-white">Ready to get started?</h2>
          <p className="mt-3 text-teal-100">Join hosts and cleaners already using {APP_NAME} across the UK.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="cta"
              className="px-8 py-3 text-base"
              onClick={() => navigate('/register')}
            >
              Get started free
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-teal-700 border border-teal-400 px-8 py-3 text-base"
              onClick={() => navigate('/search')}
            >
              Browse cleaners
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-heading text-xl font-semibold text-[#0D9488]">
            {APP_NAME}<span className="text-[#F59E0B]">.</span>
          </span>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/search" className="hover:text-[#0D9488] transition-colors">Find cleaners</Link>
            <Link to="/register" className="hover:text-[#0D9488] transition-colors">Sign up</Link>
            <Link to="/login" className="hover:text-[#0D9488] transition-colors">Log in</Link>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} {APP_NAME}. United Kingdom.</p>
        </div>
      </footer>

    </div>
  );
}
