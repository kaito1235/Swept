import { clsx } from 'clsx';

export function Input({
  label,
  error,
  className,
  id,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(
          'w-full rounded-xl border px-4 py-3 text-sm transition-colors duration-150',
          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
            : 'border-gray-200 focus:border-[#0D9488] focus:ring-teal-100',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
