import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { getMyProperties } from '../../services/propertyService';
import { getBookingStats } from '../../services/bookingService';

export function HostDashboard() {
  const { appUser } = useAuth();
  const [propertyCount, setPropertyCount] = useState(0);
  const [stats, setStats] = useState({ upcoming: 0, cleaners_hired: 0 });

  useEffect(() => {
    getMyProperties()
      .then((props) => setPropertyCount(props.length))
      .catch(() => {});
    getBookingStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl text-gray-900">
            Welcome back, {appUser?.name?.split(' ')[0]}
          </h1>
          <p className="mt-2 text-gray-500">Manage your properties and bookings.</p>
        </div>
        <Link to="/search">
          <Button variant="secondary">Find a cleaner</Button>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/properties" className="block bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#0D9488] transition-colors">
          <p className="text-sm text-gray-500">Properties</p>
          <p className="mt-1 font-heading text-4xl text-gray-900">{propertyCount}</p>
          <p className="mt-1 text-xs text-[#0D9488]">
            {propertyCount === 0 ? 'Add your first property' : 'Manage properties'}
          </p>
        </Link>

        <Link to="/bookings" className="block bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#0D9488] transition-colors">
          <p className="text-sm text-gray-500">Upcoming bookings</p>
          <p className="mt-1 font-heading text-4xl text-gray-900">{stats.upcoming ?? 0}</p>
          <p className="mt-1 text-xs text-[#0D9488]">
            {stats.upcoming > 0 ? 'View bookings' : 'No bookings yet'}
          </p>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Cleaners hired</p>
          <p className="mt-1 font-heading text-4xl text-gray-900">{stats.cleaners_hired ?? 0}</p>
          <p className="mt-1 text-xs text-[#0D9488]">
            {stats.cleaners_hired > 0 ? 'Unique cleaners' : 'Find a cleaner to get started'}
          </p>
        </div>
      </div>
    </div>
  );
}
