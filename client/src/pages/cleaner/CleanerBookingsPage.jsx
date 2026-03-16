import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../config/supabase';
import { getCleanerBookings, updateBookingStatus, confirmJob } from '../../services/bookingService';

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

const BUCKET = import.meta.env.VITE_SUPABASE_PHOTOS_BUCKET || 'booking-confirmations';

function ConfirmJobForm({ bookingId, onConfirmed }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  function handleFileChange(e) {
    const selected = Array.from(e.target.files).slice(0, 5);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please add at least one photo to confirm the job');
      return;
    }
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `${bookingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploadedUrls.push(publicUrl);
      }

      await confirmJob(bookingId, uploadedUrls);
      toast.success('Job confirmed! Payment will be released.');
      onConfirmed(bookingId);
    } catch (err) {
      console.error(err);
      toast.error('Failed to confirm job. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 border-t border-gray-100 pt-4 space-y-3">
      <p className="text-sm font-medium text-gray-700">Confirm job complete</p>
      <p className="text-xs text-gray-500">
        Upload photos showing the finished clean. This triggers payment release.
      </p>

      <label className="block">
        <span className="sr-only">Choose photos</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-xl file:border file:border-gray-200 file:text-sm file:font-medium file:text-gray-700 file:bg-white hover:file:bg-gray-50 cursor-pointer"
        />
      </label>

      {previews.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Preview ${i + 1}`}
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
      )}

      <Button type="submit" size="sm" loading={uploading}>
        Submit & confirm complete
      </Button>
    </form>
  );
}

export function CleanerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

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

  function handleConfirmed(bookingId) {
    setConfirmingId(null);
    setBookings((prev) =>
      prev.map((b) => b.id === bookingId ? { ...b, status: 'completed' } : b)
    );
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
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onUpdate={handleStatusUpdate}
                    showActions
                    confirmingId={confirmingId}
                    onStartConfirm={setConfirmingId}
                    onConfirmed={handleConfirmed}
                  />
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
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onUpdate={handleStatusUpdate}
                    showActions={false}
                    confirmingId={confirmingId}
                    onStartConfirm={setConfirmingId}
                    onConfirmed={handleConfirmed}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function BookingCard({ booking: b, onUpdate, showActions, confirmingId, onStartConfirm, onConfirmed }) {
  const isConfirming = confirmingId === b.id;

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

      {b.status === 'confirmed' && !isConfirming && (
        <div className="mt-4">
          <Button size="sm" onClick={() => onStartConfirm(b.id)}>
            Mark job complete
          </Button>
        </div>
      )}

      {isConfirming && (
        <ConfirmJobForm bookingId={b.id} onConfirmed={onConfirmed} />
      )}

      {b.status === 'completed' && b.confirmation_photos?.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-1.5">Completion photos</p>
          <div className="flex gap-2 flex-wrap">
            {b.confirmation_photos.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                <img src={url} alt={`Confirmation ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
