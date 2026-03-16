import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { getBookingStats } from '../../services/bookingService';
import { getMyCleanerProfile } from '../../services/cleanerProfileService';

function profileCompleteness(profile) {
  if (!profile) return [];
  const missing = [];
  if (!profile.bio) missing.push('bio');
  if (!profile.hourly_rate) missing.push('hourly rate');
  if (!profile.service_area) missing.push('service area');
  if (!profile.service_types?.length) missing.push('service types');
  return missing;
}

export function CleanerDashboard() {
  const { appUser } = useAuth();
  const [stats, setStats] = useState({ pending: 0, upcoming: 0, completed: 0 });
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    getBookingStats()
      .then(setStats)
      .catch(() => {});
    getMyCleanerProfile()
      .then((p) => setMissingFields(profileCompleteness(p)))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-3xl text-gray-900">
        Welcome back, {appUser?.name?.split(' ')[0]}
      </h1>
      <p className="mt-2 text-gray-500">Your jobs and earnings will appear here.</p>

      {/* Profile completeness nudge */}
      {missingFields.length > 0 && (
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="text-amber-500 text-lg shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Your profile is incomplete</p>
            <p className="mt-0.5 text-sm text-amber-700">
              You're missing: <span className="font-medium">{missingFields.join(', ')}</span>. Hosts can't book you until your profile is complete.
            </p>
          </div>
          <Link to="/cleaner/profile/edit">
            <Button size="sm" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-0">
              Complete profile
            </Button>
          </Link>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Link to="/cleaner/profile/edit">
          <Button variant="secondary">Edit profile</Button>
        </Link>
        <Link to="/cleaner/bookings">
          <Button variant={stats.pending > 0 ? 'primary' : 'ghost'}>
            {stats.pending > 0 ? `${stats.pending} new request${stats.pending > 1 ? 's' : ''}` : 'My jobs'}
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/cleaner/bookings" className="block bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#0D9488] transition-colors">
          <p className="text-sm text-gray-500">Pending requests</p>
          <p className="mt-1 font-heading text-4xl text-gray-900">{stats.pending ?? 0}</p>
          <p className="mt-1 text-xs text-[#0D9488]">
            {stats.pending > 0 ? 'Action required' : 'No new requests'}
          </p>
        </Link>

        <Link to="/cleaner/bookings" className="block bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#0D9488] transition-colors">
          <p className="text-sm text-gray-500">Upcoming jobs</p>
          <p className="mt-1 font-heading text-4xl text-gray-900">{stats.upcoming ?? 0}</p>
          <p className="mt-1 text-xs text-[#0D9488]">
            {stats.upcoming > 0 ? 'View schedule' : 'No upcoming jobs'}
          </p>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Completed jobs</p>
          <p className="mt-1 font-heading text-4xl text-gray-900">{stats.completed ?? 0}</p>
          <p className="mt-1 text-xs text-[#0D9488]">
            {stats.completed > 0 ? 'Great work!' : 'Complete jobs to earn reviews'}
          </p>
        </div>
      </div>
    </div>
  );
}
