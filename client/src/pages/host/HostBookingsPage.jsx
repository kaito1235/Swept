import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { getHostBookings, updateBookingStatus } from '../../services/bookingService';
import { createReview } from '../../services/reviewService';

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

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ bookingId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      await createReview({ bookingId, rating, comment: comment || undefined });
      toast.success('Review submitted!');
      onSubmitted();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 border-t border-gray-100 pt-4 space-y-3">
      <p className="text-sm font-medium text-gray-700">Leave a review</p>
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="How was the service? (optional)"
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
      />
      <Button type="submit" size="sm" loading={submitting}>Submit review</Button>
    </form>
  );
}

export function HostBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    getHostBookings()
      .then(setBookings)
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusUpdate(id, status) {
    const label = status === 'cancelled' ? 'Cancel this booking?' : `Mark as ${status}?`;
    if (!confirm(label)) return;
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, ...updated } : b));
      toast.success(`Booking ${status}`);
    } catch {
      toast.error('Failed to update booking');
    }
  }

  function handleReviewSubmitted(bookingId) {
    setReviewingId(null);
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, review_id: 'submitted' } : b));
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-gray-900">My bookings</h1>
        <Link to="/search">
          <Button variant="secondary">Find a cleaner</Button>
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookings yet. <Link to="/search" className="text-[#0D9488] underline">Find a cleaner</Link> to get started.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{b.cleaner_name}</p>
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

              <div className="mt-4 flex gap-2">
                {b.status === 'confirmed' && (
                  <Button size="sm" onClick={() => handleStatusUpdate(b.id, 'completed')}>
                    Mark completed
                  </Button>
                )}
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(b.id, 'cancelled')}>
                    Cancel
                  </Button>
                )}
                {b.status === 'completed' && !b.review_id && reviewingId !== b.id && (
                  <Button size="sm" variant="ghost" onClick={() => setReviewingId(b.id)}>
                    Leave a review
                  </Button>
                )}
                {b.status === 'completed' && b.review_id && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="text-yellow-400">★</span> Reviewed
                  </span>
                )}
              </div>

              {reviewingId === b.id && (
                <ReviewForm
                  bookingId={b.id}
                  onSubmitted={() => handleReviewSubmitted(b.id)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
