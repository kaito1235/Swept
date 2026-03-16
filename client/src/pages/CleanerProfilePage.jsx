import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPublicCleanerProfile } from '../services/cleanerProfileService';
import { getCleanerReviews } from '../services/reviewService';
import { getOrCreateConversation } from '../services/messageService';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

const SERVICE_LABELS = {
  standard: 'Standard',
  deep_clean: 'Deep Clean',
  move_in_out: 'Move In/Out',
  airbnb_turnover: 'Airbnb Turnover',
  office: 'Office',
  post_construction: 'Post-Construction',
};

const ALL_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function parseArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val.replace(/^{|}$/g, '').split(',').filter(Boolean);
  return [];
}

export function CleanerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  async function handleMessage() {
    setStartingChat(true);
    try {
      const conv = await getOrCreateConversation(profile.user_id);
      navigate(`/messages/${conv.id}`);
    } catch {
      toast.error('Failed to open conversation');
    } finally {
      setStartingChat(false);
    }
  }

  useEffect(() => {
    getPublicCleanerProfile(id)
      .then((p) => {
        setProfile(p);
        return getCleanerReviews(p.user_id);
      })
      .then(setReviews)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-500">Cleaner not found.</p>
      </div>
    );
  }

  const serviceTypes = parseArray(profile.service_types);
  const availability = typeof profile.availability === 'string'
    ? JSON.parse(profile.availability)
    : (profile.availability ?? {});
  const availableDays = ALL_DAYS.filter((day) => availability[day]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start gap-5">
          <div className="shrink-0 w-16 h-16 rounded-full bg-[#0D9488] text-white flex items-center justify-center font-semibold text-2xl">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              profile.name?.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1">
            <h1 className="font-heading text-2xl text-gray-900">{profile.name}</h1>
            {profile.service_area && (
              <p className="text-sm text-gray-500 mt-0.5">{profile.service_area}</p>
            )}
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              {profile.hourly_rate && (
                <span className="text-[#0D9488] font-semibold">
                  £{Number(profile.hourly_rate).toLocaleString()}/hr
                </span>
              )}
              {profile.avg_rating > 0 && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  {Number(profile.avg_rating).toFixed(1)}
                  <span className="text-gray-400">({profile.review_count} reviews)</span>
                </span>
              )}
            </div>
          </div>

          {appUser?.role === 'host' && (
            <div className="flex gap-2">
              <Button variant="secondary" loading={startingChat} onClick={handleMessage}>
                Message
              </Button>
              <Link to={`/book/${id}`}>
                <Button>Book</Button>
              </Link>
            </div>
          )}
        </div>

        {profile.bio && (
          <p className="mt-5 text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
        )}
      </div>

      {serviceTypes.length > 0 && (
        <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Services offered</h2>
          <div className="flex flex-wrap gap-2">
            {serviceTypes.map((type) => (
              <span key={type} className="px-3 py-1 text-sm bg-teal-50 text-[#0D9488] rounded-full">
                {SERVICE_LABELS[type] ?? type}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Availability</h2>
        {availableDays.length === 0 ? (
          <p className="text-sm text-gray-400">Not specified</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableDays.map((day) => (
              <span key={day} className="px-3 py-1 text-sm bg-teal-50 text-[#0D9488] rounded-full capitalize">
                {day}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">
          Reviews
          {reviews.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">({reviews.length})</span>
          )}
        </h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">{r.host_name}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-sm ${star <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                </div>
                {r.comment && (
                  <p className="mt-1 text-sm text-gray-500">{r.comment}</p>
                )}
                <p className="mt-1 text-xs text-gray-300">
                  {new Date(r.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
