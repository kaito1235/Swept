import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { getMyCleanerProfile, updateMyCleanerProfile } from '../../services/cleanerProfileService';

const SERVICE_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'deep_clean', label: 'Deep Clean' },
  { value: 'move_in_out', label: 'Move In/Out' },
  { value: 'airbnb_turnover', label: 'Airbnb Turnover' },
  { value: 'office', label: 'Office' },
  { value: 'post_construction', label: 'Post-Construction' },
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const schema = z.object({
  bio: z.string().max(500, 'Max 500 characters').optional().or(z.literal('')),
  hourly_rate: z.coerce.number().min(1, 'Must be at least 1'),
  service_area: z.string().optional().or(z.literal('')),
  service_types: z.array(z.string()).min(1, 'Select at least one service type'),
  availability: z.record(z.boolean()).optional(),
});

export function EditProfilePage() {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: '',
      hourly_rate: 15,
      service_area: '',
      service_types: [],
      availability: {},
    },
  });

  const serviceTypes = watch('service_types') ?? [];
  const availability = watch('availability') ?? {};

  useEffect(() => {
    getMyCleanerProfile()
      .then((profile) => {
        if (profile) reset({
          bio: profile.bio ?? '',
          hourly_rate: profile.hourly_rate ?? 15,
          service_area: profile.service_area ?? '',
          service_types: profile.service_types ?? [],
          availability: profile.availability ?? {},
        });
      })
      .catch(() => {});
  }, [reset]);

  function toggleServiceType(value) {
    if (serviceTypes.includes(value)) {
      setValue('service_types', serviceTypes.filter((v) => v !== value), { shouldValidate: true });
    } else {
      setValue('service_types', [...serviceTypes, value], { shouldValidate: true });
    }
  }

  function toggleDay(day) {
    setValue('availability', { ...availability, [day]: !availability[day] }, { shouldValidate: true });
  }

  async function onSubmit(data) {
    try {
      await updateMyCleanerProfile(data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-heading text-3xl text-gray-900">Edit profile</h1>
      <p className="mt-2 text-gray-500">Update your cleaner profile to attract more clients.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            {...register('bio')}
            rows={4}
            placeholder="Tell hosts about yourself, your experience, and what makes you great..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          />
          {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly rate (£)</label>
          <input
            {...register('hourly_rate')}
            type="number"
            min="1"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          />
          {errors.hourly_rate && <p className="mt-1 text-xs text-red-500">{errors.hourly_rate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service area</label>
          <input
            {...register('service_area')}
            type="text"
            placeholder="e.g. London, Manchester, Birmingham"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service types</label>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleServiceType(value)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  serviceTypes.includes(value)
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D9488]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.service_types && <p className="mt-1 text-xs text-red-500">{errors.service_types.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors capitalize ${
                  availability[day]
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D9488]'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">
          Save profile
        </Button>
      </form>
    </div>
  );
}
