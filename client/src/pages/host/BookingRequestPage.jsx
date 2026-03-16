import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { getPublicCleanerProfile } from '../../services/cleanerProfileService';
import { getMyProperties } from '../../services/propertyService';
import { createBooking } from '../../services/bookingService';

const SERVICE_LABELS = {
  standard: 'Standard',
  deep_clean: 'Deep Clean',
  move_in_out: 'Move In/Out',
  airbnb_turnover: 'Airbnb Turnover',
  office: 'Office',
  post_construction: 'Post-Construction',
};

export function BookingRequestPage() {
  const { cleanerId } = useParams();
  const navigate = useNavigate();
  const [cleaner, setCleaner] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm({
    defaultValues: { durationHours: 2, serviceType: 'standard' },
  });

  const durationHours = watch('durationHours');

  useEffect(() => {
    Promise.all([
      getPublicCleanerProfile(cleanerId),
      getMyProperties(),
    ])
      .then(([c, props]) => {
        setCleaner(c);
        setProperties(props);
      })
      .catch(() => toast.error('Failed to load page data'))
      .finally(() => setLoading(false));
  }, [cleanerId]);

  async function onSubmit(data) {
    try {
      await createBooking({
        cleanerId: cleaner.user_id,
        propertyId: data.propertyId,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        durationHours: Number(data.durationHours),
        serviceType: data.serviceType,
        notes: data.notes || undefined,
      });
      toast.success('Booking request sent!');
      navigate('/bookings');
    } catch {
      toast.error('Failed to send booking request');
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!cleaner) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-500">Cleaner not found.</p>
      </div>
    );
  }

  const estimatedTotal = cleaner.hourly_rate
    ? Number(cleaner.hourly_rate) * Number(durationHours || 0)
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      <h1 className="font-heading text-3xl text-gray-900">Book a cleaner</h1>

      {/* Cleaner summary */}
      <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
        <div className="shrink-0 w-12 h-12 rounded-full bg-[#0D9488] text-white flex items-center justify-center font-semibold text-lg">
          {cleaner.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{cleaner.name}</p>
          <p className="text-sm text-gray-500">{cleaner.service_area}</p>
        </div>
        {cleaner.hourly_rate && (
          <span className="ml-auto text-[#0D9488] font-semibold">
            £{Number(cleaner.hourly_rate).toLocaleString()}/hr
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        {/* Property */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
          {properties.length === 0 ? (
            <p className="text-sm text-amber-600">
              You have no properties yet.{' '}
              <a href="/properties" className="underline">Add one first</a>.
            </p>
          ) : (
            <select
              {...register('propertyId', { required: 'Please select a property' })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            >
              <option value="">Select a property</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.address}</option>
              ))}
            </select>
          )}
          {errors.propertyId && <p className="mt-1 text-xs text-red-500">{errors.propertyId.message}</p>}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              {...register('scheduledDate', { required: 'Date is required' })}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
            {errors.scheduledDate && <p className="mt-1 text-xs text-red-500">{errors.scheduledDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start time *</label>
            <input
              {...register('scheduledTime', { required: 'Time is required' })}
              type="time"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
            {errors.scheduledTime && <p className="mt-1 text-xs text-red-500">{errors.scheduledTime.message}</p>}
          </div>
        </div>

        {/* Duration & Service type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours) *</label>
            <input
              {...register('durationHours', { required: true, min: 1, max: 12 })}
              type="number"
              min="1"
              max="12"
              step="0.5"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service type</label>
            <select
              {...register('serviceType')}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            >
              {Object.entries(SERVICE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes for cleaner</label>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Access instructions, specific areas to focus on..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          />
        </div>

        {/* Price estimate */}
        {estimatedTotal !== null && (
          <div className="bg-teal-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">Estimated total</span>
            <span className="font-semibold text-[#0D9488]">£{estimatedTotal.toLocaleString()}</span>
          </div>
        )}

        <Button
          type="submit"
          loading={isSubmitting}
          disabled={properties.length === 0}
          className="w-full"
        >
          Send booking request
        </Button>
      </form>
    </div>
  );
}
