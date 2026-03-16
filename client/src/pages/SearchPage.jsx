import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CleanerCard } from '../components/ui/CleanerCard';
import { searchCleaners } from '../services/cleanerProfileService';

const SERVICE_FILTERS = [
  { value: '', label: 'All' },
  { value: 'standard', label: 'Standard' },
  { value: 'deep_clean', label: 'Deep Clean' },
  { value: 'airbnb_turnover', label: 'Airbnb Turnover' },
  { value: 'move_in_out', label: 'Move In/Out' },
  { value: 'office', label: 'Office' },
  { value: 'post_construction', label: 'Post-Construction' },
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [serviceType, setServiceType] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const debounceRef = useRef(null);

  async function runSearch(filters) {
    setLoading(true);
    try {
      const data = await searchCleaners(filters);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Auto-search whenever filters change
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch({ area, serviceType, maxRate });
    }, area ? 400 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [area, serviceType, maxRate]);

  // Sync area to URL
  useEffect(() => {
    if (area) setSearchParams({ area });
    else setSearchParams({});
  }, [area]);

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      {/* Sticky filter bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Location search */}
          <div className="relative max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Search by city or area..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-gray-50"
            />
          </div>

          {/* Service type chips + price */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SERVICE_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setServiceType(value)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  serviceType === value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {label}
              </button>
            ))}

            <div className="shrink-0 ml-2 flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 bg-white">
              <span className="text-xs text-gray-500">Max</span>
              <span className="text-xs text-gray-500">£</span>
              <input
                type="number"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                placeholder="Any"
                min="0"
                className="w-14 text-sm focus:outline-none bg-transparent"
              />
              <span className="text-xs text-gray-400">/hr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && results === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-2xl bg-gray-200 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : results !== null && results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-heading text-xl text-gray-700">No cleaners found</p>
            <p className="mt-2 text-gray-400">Try a different area or remove some filters.</p>
          </div>
        ) : results !== null ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {loading ? 'Updating…' : `${results.length} cleaner${results.length !== 1 ? 's' : ''} available`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((cleaner) => (
                <CleanerCard key={cleaner.id} cleaner={cleaner} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
