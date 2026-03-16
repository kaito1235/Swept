import { clsx } from 'clsx';

const variants = {
  primary: 'bg-[#0D9488] text-white hover:bg-[#0f766e] focus:ring-[#0D9488]',
  secondary: 'bg-[#F7F3EE] text-[#0D9488] border border-[#0D9488] hover:bg-teal-50 focus:ring-[#0D9488]',
  ghost: 'text-[#0D9488] hover:bg-teal-50 focus:ring-[#0D9488]',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  // High-contrast option for buttons on dark/teal backgrounds
  cta: 'bg-white text-[#0D9488] hover:bg-teal-50 focus:ring-white shadow-md shadow-teal-900/20',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200',
        sizes[size],
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
