import { Link } from 'react-router-dom';

const SERVICE_LABELS = {
  standard: 'Standard',
  deep_clean: 'Deep Clean',
  move_in_out: 'Move In/Out',
  airbnb_turnover: 'Airbnb Turnover',
  office: 'Office',
  post_construction: 'Post-Construction',
};

// Deterministic gradient per cleaner
const GRADIENTS = [
  'from-rose-300 to-orange-200',
  'from-violet-300 to-purple-200',
  'from-teal-300 to-emerald-200',
  'from-blue-300 to-indigo-200',
  'from-amber-300 to-yellow-200',
  'from-pink-300 to-rose-200',
  'from-green-300 to-teal-200',
  'from-indigo-300 to-sky-200',
];

function getGradient(id) {
  const idx = (id?.charCodeAt(0) ?? 0) % GRADIENTS.length;
  return GRADIENTS[idx];
}

function parseArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val.replace(/^{|}$/g, '').split(',').filter(Boolean);
  return [];
}

export function CleanerCard({ cleaner }) {
  const { id, name, avatar, bio, hourly_rate, service_area, avg_rating, review_count } = cleaner;
  const service_types = parseArray(cleaner.service_types);
  const gradient = getGradient(id);
  const city = service_area?.split(',')[0] ?? service_area;

  return (
    <Link to={`/cleaners/${id}`} className="group block">
      {/* Photo area */}
      <div className={`relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${gradient} overflow-hidden mb-3`}>
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white font-heading text-6xl font-semibold opacity-60 select-none">
              {name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Rating badge */}
        {avg_rating > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-semibold text-gray-800 shadow-sm">
            <span className="text-yellow-400">★</span>
            {Number(avg_rating).toFixed(1)}
          </div>
        )}
        {/* Service type pill */}
        {service_types[0] && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm">
            {SERVICE_LABELS[service_types[0]] ?? service_types[0]}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate group-hover:text-[#0D9488] transition-colors">
              {name}
            </p>
            {city && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">{city}</p>
            )}
          </div>
          {hourly_rate && (
            <p className="shrink-0 text-sm font-semibold text-gray-900">
              £{Number(hourly_rate).toLocaleString()}<span className="font-normal text-gray-400"> /hr</span>
            </p>
          )}
        </div>

        {bio && (
          <p className="mt-1 text-sm text-gray-400 line-clamp-1">{bio}</p>
        )}

        {review_count > 0 && (
          <p className="mt-1 text-xs text-gray-400">{review_count} review{review_count !== 1 ? 's' : ''}</p>
        )}
      </div>
    </Link>
  );
}
