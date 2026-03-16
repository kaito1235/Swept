import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { getMyProperties, createProperty, deleteProperty } from '../../services/propertyService';

export function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    getMyProperties()
      .then(setProperties)
      .catch(() => toast.error('Failed to load properties'));
  }, []);

  async function onSubmit(data) {
    try {
      const created = await createProperty({
        ...data,
        bedrooms: data.bedrooms ? Number(data.bedrooms) : undefined,
        bathrooms: data.bathrooms ? Number(data.bathrooms) : undefined,
      });
      setProperties((prev) => [created, ...prev]);
      reset();
      setShowForm(false);
      toast.success('Property added!');
    } catch {
      toast.error('Failed to add property');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this property?')) return;
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast.success('Property deleted');
    } catch {
      toast.error('Failed to delete property');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-gray-900">Properties</h1>
        <Button onClick={() => setShowForm((v) => !v)} variant={showForm ? 'secondary' : 'primary'}>
          {showForm ? 'Cancel' : '+ Add property'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">New property</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              {...register('name', { required: true })}
              placeholder="e.g. Chelsea Flat 3B"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              {...register('address', { required: true })}
              placeholder="Full address"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input
                {...register('bedrooms')}
                type="number"
                min="0"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input
                {...register('bathrooms')}
                type="number"
                min="0"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size (sqm)</label>
              <input
                {...register('size')}
                type="number"
                min="0"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Access instructions, special notes..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <Button type="submit" loading={isSubmitting}>Add property</Button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {properties.length === 0 ? (
          <p className="text-gray-500 text-sm">No properties yet. Add your first one above.</p>
        ) : (
          properties.map((p) => (
            <PropertyCard key={p.id} property={p} onDelete={() => handleDelete(p.id)} />
          ))
        )}
      </div>
    </div>
  );
}
