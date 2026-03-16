import { Button } from './Button';

export function PropertyCard({ property, onDelete }) {
  const { name, address, bedrooms, bathrooms, size, notes } = property;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{address}</p>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
            {bedrooms != null && <span>{bedrooms} bed</span>}
            {bathrooms != null && <span>{bathrooms} bath</span>}
            {size && <span>{size} sqm</span>}
          </div>

          {notes && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{notes}</p>
          )}
        </div>

        <Button
          variant="danger"
          className="text-xs px-3 py-1.5 shrink-0"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
