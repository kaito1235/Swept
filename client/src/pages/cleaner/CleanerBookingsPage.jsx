import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { getCleanerBookings, updateBookingStatus } from '../../services/bookingService';

const STATUS_STYLES = {
  pending:   'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-teal-50 text-[#0D9488]',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-50 text-red-500',
};

const SERVICE_LABELS = {
  standard: 'Standard',
  deep_clean: 'Deep Clean',
  move_in_out: 'Move In/Out',
  airbnb_turnover: 'Airbnb Turnover',
  office: 'Office',
  post_construction: 'Post-Construction',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function CleanerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCleanerBookings()
      .then(setBookings)
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusUpdate(id, status) {
    const label = status === 'confirmed' ? 'Accept this booking?' : 'Decline this booking?';
    if (!confirm(label)) return;
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, ...updated } : b));
      toast.success(status === 'confirmed' ? 'Booking accepted!' : 'Booking declined');
    } catch {
      toast.error('Failed to update booking');
    }
  }

  const pending = bookings.filter((b) => b.status === 'pending');
  const others = bookings.filter((b) => b.status !== 'pending');

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-heading text-3xl text-gray-900">My jobs</h1>

      {bookings.length === 0 ? (
        <p className="mt-6 text-gray-500 text-sm">No booking requests yet. Make sure your profile is complete so hosts can find you.</p>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Requests ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map((b) => (
                  <BookingCard key={b.id} booking={b} onUpdate={handleStatusUpdate} showActions />
                ))}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                All bookings
              </h2>
              <div className="space-y-4">
                {others.map((b) => (
                  <BookingCard key={b.id} booking={b} onUpdate={handleStatusUpdate} showActions={false} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function BookingCard({ booking: b, onUpdate, showActions }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-900">{b.host_name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{b.property_name} · {b.property_address}</p>
        </div>
        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status]}`}>
          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
        <span>📅 {formatDate(b.scheduled_date)}</span>
        <span>🕐 {b.scheduled_time?.slice(0, 5)}</span>
        <span>⏱ {b.duration_hours}h</span>
        <span>🧹 {SERVICE_LABELS[b.service_type] ?? b.service_type}</span>
        {b.total_price && (
          <span className="text-[#0D9488] font-medium">£{Number(b.total_price).toLocaleString()}</span>
        )}
      </div>

      {b.notes && (
        <p className="mt-2 text-sm text-gray-400 italic">"{b.notes}"</p>
      )}

      {showActions && b.status === 'pending' && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={() => onUpdate(b.id, 'confirmed')}>Accept</Button>
          <Button size="sm" variant="secondary" onClick={() => onUpdate(b.id, 'cancelled')}>Decline</Button>
        </div>
      )}
    </div>
  );
}
