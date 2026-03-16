import { clsx } from 'clsx';

export function RoleCard({ title, description, icon, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full text-left rounded-2xl border-2 p-6 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2',
        selected
          ? 'border-[#0D9488] bg-teal-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-[#0D9488] hover:shadow-sm'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={clsx(
          'flex-shrink-0 rounded-xl p-3',
          selected ? 'bg-[#0D9488] text-white' : 'bg-[#F7F3EE] text-[#0D9488]'
        )}>
          {icon}
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {selected && (
          <div className="ml-auto flex-shrink-0 text-[#0D9488]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
